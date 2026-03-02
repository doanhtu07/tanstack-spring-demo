import { createFileRoute } from '@tanstack/react-router'
import styles from '@/styles/app.module.css'
import { getTestId } from '@/utils/test-ids'
import { Navbar } from '@/features/navbar/navbar'

const TEST_ID_ROOT = 'app'

const RouteComponent = () => {
  const { user } = Route.useRouteContext()

  return (
    <main className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <Navbar user={user} hideApp {...getTestId([TEST_ID_ROOT, 'navbar'])} />
      <p>Hello {user.email}!</p>
    </main>
  )
}

// MARK: Route

export const Route = createFileRoute('/_authenticated/app')({
  component: RouteComponent,
})
