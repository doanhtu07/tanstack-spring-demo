import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'
import type { SignupFormState } from '@/features/auth/signup/signup-form/types'
import styles from '@/styles/signup.module.css'
import { Button } from '@/components/button/button'
import { getTestId } from '@/utils/test-ids'
import { Navbar } from '@/features/navbar/navbar'
import { SignupForm } from '@/features/auth/signup/signup-form/signup-form'
import { useStore } from '@/providers/store-provider'

const TEST_ID_ROOT = 'signup'

const RouteComponent = observer(() => {
  const { authStore } = useStore()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [signupFormState, setSignupFormState] = useState<SignupFormState>()
  const [error, setError] = useState<string>()

  const handleSignup = () => {
    if (!signupFormState?.isFormValid) return

    authStore
      .signup({
        queryClient,
        email: signupFormState.formData.signinForm.formData.email,
        password: signupFormState.formData.signinForm.formData.password,
      })
      .then(() => {
        navigate({ to: '/app' })
      })
      .catch(() => {
        setError('Something went wrong. Please try again.')
      })
  }

  // MARK: Effects

  useEffect(() => {
    setError(undefined)
  }, [signupFormState])

  // MARK: Renderers

  return (
    <main className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <Navbar hideSignup {...getTestId([TEST_ID_ROOT, 'navbar'])} />

      <h1>Let&apos;s get started!</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSignup()
        }}
        {...getTestId([TEST_ID_ROOT, 'form'])}
      >
        <SignupForm
          monitorChange={(formState) => {
            setSignupFormState(formState)
          }}
          {...getTestId([TEST_ID_ROOT, 'signupForm'])}
        />

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          disabled={!signupFormState?.isFormValid}
          {...getTestId([TEST_ID_ROOT, 'submitButton'])}
        >
          <p>Sign up</p>
        </Button>
      </form>
    </main>
  )
})

// MARK: Route

export const Route = createFileRoute('/_unauthenticated/signup')({
  component: RouteComponent,
})
