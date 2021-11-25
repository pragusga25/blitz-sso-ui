import { AppProps } from "blitz"

import { ChakraProvider } from "@chakra-ui/react"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return <ChakraProvider>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
}
