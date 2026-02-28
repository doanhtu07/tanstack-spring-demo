import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { SignupFormState } from '@/features/auth/signup/signup-form/types'
import styles from '@/styles/signup.module.css'
import { useTheme } from '@/providers/theme-provider'
import { Button } from '@/components/button/button'
import { getTestId } from '@/utils/test-ids'
import { Navbar } from '@/components/navbar/navbar'
import { SignupForm } from '@/features/auth/signup/signup-form/signup-form'

const TEST_ID_ROOT = 'signup'

const RouteComponent = () => {
  const { toggleTheme } = useTheme()

  const [signupFormState, setSignupFormState] = useState<SignupFormState>()

  return (
    <div className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <Navbar hideSignup {...getTestId([TEST_ID_ROOT, 'navbar'])} />

      <h1>Let&apos;s get started!</h1>

      <Button
        onClick={() => toggleTheme()}
        {...getTestId([TEST_ID_ROOT, 'toggleTheme'])}
      >
        <p>Toggle theme</p>
      </Button>

      <form className={styles.form} {...getTestId([TEST_ID_ROOT, 'form'])}>
        <SignupForm
          monitorChange={(formState) => {
            setSignupFormState(formState)
          }}
          {...getTestId([TEST_ID_ROOT, 'signupForm'])}
        />

        <Button
          type="submit"
          disabled={!signupFormState?.isFormValid}
          {...getTestId([TEST_ID_ROOT, 'submitButton'])}
        >
          <p>Sign up</p>
        </Button>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})
