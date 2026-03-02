import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { getCurrentUser } from '@/orval/auth-controller'

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookie = getRequestHeader('cookie') // This contains the browser's cookies

    const user = await getCurrentUser({
      headers: { cookie },
    })

    return user
  },
)
