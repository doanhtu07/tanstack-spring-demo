import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/heartbeat')({
  server: {
    handlers: {
      GET: () => {
        return Response.json({ status: 'ok' })
      },
    },
  },
})
