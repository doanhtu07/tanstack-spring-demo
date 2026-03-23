import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/server-proxy/$')({
  server: {
    handlers: {
      ANY: async ({ request, params }) => {
        const url = new URL(request.url)

        const targetUrl = new URL(
          `${import.meta.env.VITE_SERVER_URL}/${params._splat ?? ''}${url.search}`,
        )

        const clientIp =
          request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
          request.headers.get('x-real-ip') ||
          url.hostname // last resort fallback

        const headers = new Headers(request.headers)
        headers.set('host', targetUrl.hostname)
        headers.set('x-forwarded-proto', url.protocol.replace(':', ''))
        headers.set(
          'x-forwarded-host',
          request.headers.get('host') || url.hostname, // Original host
        )
        headers.set(
          'x-forwarded-for',
          clientIp, // Original client IP
        )
        headers.delete('connection') // hop-by-hop header, must be stripped

        let response: Response
        if (['HEAD', 'GET'].includes(request.method)) {
          response = await fetch(targetUrl, {
            method: request.method,
            headers,
          })
        } else {
          const requestTextBody = await request.text()

          response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body: requestTextBody,
            duplex: 'half',
          } as RequestInit)
        }

        const responseHeaders = new Headers(response.headers)
        // Strip to avoid double-decompression on the client
        responseHeaders.delete('content-encoding')
        responseHeaders.delete('content-length')
        responseHeaders.delete('transfer-encoding')

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        })
      },
    },
  },
})
