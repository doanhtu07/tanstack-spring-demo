import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { translate, useHello } from '@/orval/demo-controller'
import { useCsrf } from '@/providers/CsrfProvider'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { ready } = useCsrf()

  const { data } = useHello({
    query: {
      staleTime: 1000 * 60,
    },
  })

  const helloMessage = data?.message ?? 'No message'

  // MARK: Effects

  useEffect(() => {
    console.log('hello', helloMessage)
  }, [helloMessage])

  useEffect(() => {
    if (!ready) return

    translate(
      { text: 'Hello world' },
      {
        auth: { username: 'tudope', password: 'test123' },
      },
    )
      .then((res) => {
        console.log('translate', res.message)
      })
      .catch((err) => {
        console.error('translate error', err)
      })
  }, [ready])

  // MARK: Renderers

  return <div>Test</div>
}
