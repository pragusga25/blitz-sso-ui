import { BlitzApiHandler, getSession } from "blitz"
import got from "got"
import { XMLParser } from "fast-xml-parser"
import db from "db"
import { Role } from "types"
import { config } from "../../auth/config"

const handler: BlitzApiHandler = async (req, res) => {
  const ticket = req.query["ticket"]

  const session = await getSession(req, res)
  try {
    const parser = new XMLParser()

    const response = await got(new URL("./serviceValidate", config.CAS_URL), {
      searchParams: {
        service: config.SERVICE_URL,
        ticket: Array.isArray(ticket) ? ticket[0] : ticket,
      },
    })

    const parsed = parser.parse(response.body)

    const serviceResponse = parsed["cas:serviceResponse"]

    if (serviceResponse["cas:authenticationFailure"]) {
      return res.status(401).send("Invalid ticket")
    }

    const {
      "cas:user": username,
      "cas:attributes": { "cas:nama": name },
    }: { "cas:user": string; "cas:attributes": { "cas:nama": string } } =
      serviceResponse["cas:authenticationSuccess"]

    const sso = {
      username,
      name,
    }

    const user = await db.user.upsert({
      where: { username },
      create: {
        ...sso,
        role: "USER" as Role,
      },
      update: {
        name: sso.name,
      },
      select: { id: true, role: true },
    })

    await session.$create({ userId: user.id, role: user.role as Role })

    res.status(200).redirect("/")
  } catch (error) {
    res.status(500).send("error")
  }
}

export default handler
