import { Outlet, createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'

export const Route = createFileRoute('/demo')({
  component: DemoLayoutComponent,
})

function DemoLayoutComponent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
