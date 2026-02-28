import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { SigninFormState } from '@/features/auth/signin/signin-form/types'
import styles from '@/styles/signin.module.css'
import { useTheme } from '@/providers/theme-provider'
import { Button } from '@/components/button/button'
import { getTestId } from '@/utils/test-ids'
import { SigninForm } from '@/features/auth/signin/signin-form/signin-form'
import { Navbar } from '@/components/navbar/navbar'

const TEST_ID_ROOT = 'signin'

const RouteComponent = () => {
  const { toggleTheme } = useTheme()

  const [signinFormState, setSigninFormState] = useState<SigninFormState>()

  return (
    <div className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <Navbar hideSignin {...getTestId([TEST_ID_ROOT, 'navbar'])} />

      <h1>Welcome!</h1>

      <Button
        onClick={() => toggleTheme()}
        {...getTestId([TEST_ID_ROOT, 'toggleTheme'])}
      >
        <p>Toggle theme</p>
      </Button>

      <form className={styles.form} {...getTestId([TEST_ID_ROOT, 'form'])}>
        <SigninForm
          isSignup={false}
          monitorChange={(formState) => {
            setSigninFormState(formState)
          }}
          {...getTestId([TEST_ID_ROOT, 'signinForm'])}
        />

        <Button
          type="submit"
          disabled={!signinFormState?.isFormValid}
          {...getTestId([TEST_ID_ROOT, 'submitButton'])}
        >
          <p>Sign in</p>
        </Button>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})
