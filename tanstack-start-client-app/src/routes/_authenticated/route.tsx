import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '@/api/get-current-user'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    try {
      const user = await getCurrentUserFn()
      return { user }
    } catch (err) {
      // Re-throw redirects (they're intentional, not errors)
      if (isRedirect(err)) throw err

      throw redirect({
        to: '/signin',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }
  },
})
