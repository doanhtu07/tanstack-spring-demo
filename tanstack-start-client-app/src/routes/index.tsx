import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Trans, useTranslation } from 'react-i18next'
import { useCsrf } from '@/providers/csrf-provider'
import { Button } from '@/components/button/button'
import { useTheme } from '@/providers/theme-provider'
import { useStore } from '@/providers/store-provider'
import { Divider } from '@/components/divider/divider'
import { postTranslate, useGetHello } from '@/orval/demo-controller'
import styles from '@/styles/home.module.css'
import { getTestId } from '@/utils/test-ids'
import { CustomLink } from '@/components/custom-link/custom-link'

const TEST_ID_ROOT = 'home'

const Home = observer(() => {
  const { ready } = useCsrf()
  const { toggleTheme, setTheme } = useTheme()
  const { counterStore } = useStore()
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
    <div className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <CustomLink to="/signin" {...getTestId([TEST_ID_ROOT, 'signinLink'])}>
        <p>Sign in</p>
      </CustomLink>

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
    </div>
  )
})

export const Route = createFileRoute('/')({
  component: Home,
})
