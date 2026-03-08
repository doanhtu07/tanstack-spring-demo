const getXsrfToken = () => {
  if (typeof document === 'undefined') return ''
  const match = new RegExp(/(^| )XSRF-TOKEN=([^;]+)/).exec(document.cookie)
  return match ? decodeURIComponent(match[2]) : ''
}

export const authenticatedFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  return fetch(input, {
    ...init,
    credentials: 'include', // The JSESSIONID part
    headers: {
      ...init?.headers,
      'X-XSRF-TOKEN': getXsrfToken(), // The Spring CSRF part
    },
  })
}
