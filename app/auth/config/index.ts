export const config = {
  CAS_URL: "https://sso.ui.ac.id/cas2/",
  SERVICE_URL: process.env.BLITZ_PUBLIC_SERVICE_URL || "http://localhost:3000/api/auth/sso-ui",
  PATHNAME: "/api/auth/sso-ui",
}
