import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '@/api/get-current-user'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: async () => {
    try {
      await getCurrentUserFn()

      throw redirect({
        to: '/app',
      })
    } catch (err) {
      // Re-throw redirects (they're intentional, not errors)
      if (isRedirect(err)) throw err
    }
  },
})
