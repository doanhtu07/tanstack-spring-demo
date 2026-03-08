import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Trans, useTranslation } from 'react-i18next'
import { useCsrf } from '@/providers/csrf-provider'
import { Button } from '@/components/button/button'
import { useTheme } from '@/providers/theme-provider'
import { useStore } from '@/providers/store-provider'
import { Divider } from '@/components/divider/divider'
import { useGetHello } from '@/orval/demo-controller'
import styles from '@/styles/home.module.css'
import { getTestId } from '@/utils/test-ids'
import { CustomLink } from '@/components/custom-link/custom-link'
import { Navbar } from '@/features/navbar/navbar'
import { getCurrentUserFn } from '@/server-actions/get-current-user'

const TEST_ID_ROOT = 'home'

const Home = observer(() => {
  const { user } = Route.useRouteContext()
  const { ready } = useCsrf()
  const { toggleTheme, setTheme } = useTheme()
  const { counterStore, demoApiStore } = useStore()
  const { t } = useTranslation('ns_home')

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
    demoApiStore.testUpperCase().then()
  }, [demoApiStore, ready])

  // MARK: Renderers

  return (
    <main className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <Navbar user={user} hideHome {...getTestId([TEST_ID_ROOT, 'navbar'])} />

      <p>{t('t_welcomeMessage')}</p>
      <p>{t('t_notifications', { count: 1 })}</p>
      <p>{t('t_notifications', { count: 2 })}</p>

      <Trans
        ns="ns_home"
        i18nKey="t_complexMessage"
        values={{ helloMessage, count }}
        components={{
          Text: <p />,
          Bold: <strong title={t('t_helloMessage')} />,
          Link: <CustomLink to="/" />,
        }}
      />

      <Divider />

      <Button
        onClick={() => toggleTheme()}
        {...getTestId([TEST_ID_ROOT, 'toggleTheme'])}
      >
        <p>Toggle theme</p>
      </Button>

      <Button
        onClick={() => setTheme('system')}
        {...getTestId([TEST_ID_ROOT, 'systemTheme'])}
      >
        <p>System theme</p>
      </Button>

      <Divider />

      <p>Counter: {count}</p>

      <Button
        onClick={() => counterStore.increment()}
        {...getTestId([TEST_ID_ROOT, 'incrementCounter'])}
      >
        <p>Increment counter</p>
      </Button>

      <Button
        onClick={() => counterStore.decrement()}
        {...getTestId([TEST_ID_ROOT, 'decrementCounter'])}
      >
        <p>Decrement counter</p>
      </Button>
    </main>
  )
})

// MARK: Route

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    try {
      const user = await getCurrentUserFn()
      return { user }
    } catch (err) {
      // If there is an error, we can assume the user is not authenticated
      return { user: undefined }
    }
  },
  component: Home,
})
