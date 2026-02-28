import { createFileRoute } from '@tanstack/react-router'
import styles from '@/styles/signin.module.css'
import { useTheme } from '@/providers/theme-provider'
import { Button } from '@/components/button/button'
import { getTestId } from '@/utils/test-ids'
import { Input } from '@/components/input/input'
import { CustomLink } from '@/components/custom-link/custom-link'

const TEST_ID_ROOT = 'signin'

const RouteComponent = () => {
  const { toggleTheme } = useTheme()

  return (
    <div className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <CustomLink to="/" {...getTestId([TEST_ID_ROOT, 'homeLink'])}>
        <p>Back home</p>
      </CustomLink>

      <h1>Welcome!</h1>

      <Button
        onClick={() => toggleTheme()}
        {...getTestId([TEST_ID_ROOT, 'toggleTheme'])}
      >
        <p>Toggle theme</p>
      </Button>

      <form className={styles.form} {...getTestId([TEST_ID_ROOT, 'form'])}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>

          <Input
            inputProps={{ id: 'email', type: 'email', autoComplete: 'email' }}
            {...getTestId([TEST_ID_ROOT, 'email'])}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>

          <Input
            inputProps={{ id: 'password', type: 'password' }}
            {...getTestId([TEST_ID_ROOT, 'password'])}
          />
        </div>

        <Button {...getTestId([TEST_ID_ROOT, 'submit'])}>Sign in</Button>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})
