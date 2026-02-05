import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { translate, useHello } from '@/orval/demo-controller'
import { useCsrf } from '@/providers/CsrfProvider'
import { cn } from '@/utils/tailwind-merge'
import { Button } from '@/components/button/button'
import homeCss from '@/styles/home.css?url'

const TEST_ID_ROOT = 'index'

export const Route = createFileRoute('/')({
  component: Home,

  head: () => ({
    links: [
      {
        rel: 'stylesheet',
        href: homeCss,
      },
    ],
  }),
})

function Home() {
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

  return (
    <div className={cn('flex flex-col')} data-testid={`${TEST_ID_ROOT}_root`}>
      <p>Test</p>

      <Button>
        <p>Click me!</p>
      </Button>
    </div>
  )
}
