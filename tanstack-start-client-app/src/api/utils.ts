export const getBaseUrl = () => {
  if (typeof window !== 'undefined')
    return `${window.location.origin}/server-proxy` // Browser
  return `${process.env.VITE_SERVER_URL}` // SSR - go direct to Spring Boot
}
