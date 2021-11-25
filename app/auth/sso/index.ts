import { config } from "../config"
export const sso = () => {
  if (typeof window !== "undefined")
    return window.location.replace(`${config.CAS_URL}?service=${config.SERVICE_URL}`)
}
