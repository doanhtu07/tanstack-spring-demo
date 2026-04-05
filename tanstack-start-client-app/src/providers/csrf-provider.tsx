import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { getCsrfInit } from '@/orval/csrf-controller'

type CsrfProviderProps = PropsWithChildren

const CsrfContext = createContext<{ ready: boolean }>({ ready: false })

export const CsrfProvider = ({ children }: CsrfProviderProps) => {
  const [ready, setReady] = useState(false)

  const csrfObj = useMemo(() => ({ ready }), [ready])

  useEffect(() => {
    let mounted = true

    // Same-origin setup (with CSRF cookie)
    // - Hit the server to initialize session & CSRF
    // - This approach with CSRF cookie only works for same-origin
    getCsrfInit().finally(() => {
      if (mounted) setReady(true)
    })

    // Cross-origin setup (manually get the token and set it in header)
    // - Not recommended
    // getCsrfToken().then(({ token }) => {
    //   if (mounted) {
    //     axiosApiInstance.defaults.headers.common['X-XSRF-TOKEN'] = token
    //     setReady(true)
    //   }
    // })

    return () => {
      mounted = false
    }
  }, [])

  return <CsrfContext.Provider value={csrfObj}>{children}</CsrfContext.Provider>
}

export const useCsrf = () => useContext(CsrfContext)
