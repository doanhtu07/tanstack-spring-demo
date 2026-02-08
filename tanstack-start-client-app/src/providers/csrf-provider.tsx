import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initCsrf } from '@/orval/demo-controller'

const CsrfContext = createContext<{ ready: boolean }>({ ready: false })

export const CsrfProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false)

  const csrfObj = useMemo(() => ({ ready }), [ready])

  useEffect(() => {
    let mounted = true

    // Hit the server to initialize session & CSRF
    initCsrf().finally(() => {
      if (mounted) setReady(true)
    })

    return () => {
      mounted = false
    }
  }, [])

  return <CsrfContext.Provider value={csrfObj}>{children}</CsrfContext.Provider>
}

export const useCsrf = () => useContext(CsrfContext)
