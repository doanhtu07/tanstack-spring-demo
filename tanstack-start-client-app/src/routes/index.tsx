import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useCsrf } from '@/providers/csrf-provider'
import { cn } from '@/utils/tailwind-merge'
import { Button } from '@/components/button/button'
import { useTheme } from '@/providers/theme-provider'
import { useStore } from '@/providers/store-provider'
import { Divider } from '@/components/divider/divider'
import { postTranslate, useGetHello } from '@/orval/demo-controller'

const TEST_ID_ROOT = 'index'

const Home = observer(() => {
  const { ready } = useCsrf()
  const { toggleTheme, setTheme } = useTheme()
  const { counterStore } = useStore()

  const count = counterStore.count

  const { data } = useGetHello({
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

    postTranslate(
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
    <div
      className={cn('flex flex-col gap-2 p-10')}
      data-testid={`${TEST_ID_ROOT}_root`}
    >
      <p>Welcome!</p>

      <Button
        onClick={() => toggleTheme()}
        data-testid={`${TEST_ID_ROOT}_toggleTheme`}
      >
        <p>Toggle theme</p>
      </Button>

      <Button
        onClick={() => setTheme('system')}
        data-testid={`${TEST_ID_ROOT}_systemTheme`}
      >
        <p>System theme</p>
      </Button>

      <Divider />

      <p>Counter: {count}</p>

      <Button
        onClick={() => counterStore.increment()}
        data-testid={`${TEST_ID_ROOT}_incrementCounter`}
      >
        <p>Increment counter</p>
      </Button>

      <Button
        onClick={() => counterStore.decrement()}
        data-testid={`${TEST_ID_ROOT}_decrementCounter`}
      >
        <p>Decrement counter</p>
      </Button>
    </div>
  )
})

export const Route = createFileRoute('/')({
  component: Home,
})
