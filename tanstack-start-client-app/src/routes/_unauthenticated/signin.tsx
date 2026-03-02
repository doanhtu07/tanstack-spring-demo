import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import z from 'zod'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'
import type { SigninFormState } from '@/features/auth/signin/signin-form/types'
import styles from '@/styles/signin.module.css'
import { Button } from '@/components/button/button'
import { getTestId } from '@/utils/test-ids'
import { SigninForm } from '@/features/auth/signin/signin-form/signin-form'
import { Navbar } from '@/features/navbar/navbar'
import { useStore } from '@/providers/store-provider'

const TEST_ID_ROOT = 'signin'

const RouteComponent = observer(() => {
  const { redirect } = Route.useSearch()
  const { authStore } = useStore()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [signinFormState, setSigninFormState] = useState<SigninFormState>()
  const [error, setError] = useState<string>()

  const handleSignin = () => {
    if (!signinFormState?.isFormValid) return

    authStore
      .signin({
        queryClient,
        email: signinFormState.formData.email,
        password: signinFormState.formData.password,
      })
      .then(() => {
        navigate({ to: redirect || '/app' })
      })
      .catch(() => {
        setError('Invalid email or password. Please try again.')
      })
  }

  // MARK: Effects

  useEffect(() => {
    setError(undefined)
  }, [signinFormState])

  // MARK: Renderers

  return (
    <main className={styles.root} {...getTestId([TEST_ID_ROOT, 'root'])}>
      <Navbar hideSignin {...getTestId([TEST_ID_ROOT, 'navbar'])} />

      <h1>Welcome!</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSignin()
        }}
        {...getTestId([TEST_ID_ROOT, 'form'])}
      >
        <SigninForm
          isSignup={false}
          monitorChange={(formState) => {
            setSigninFormState(formState)
          }}
          {...getTestId([TEST_ID_ROOT, 'signinForm'])}
        />

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          disabled={!signinFormState?.isFormValid}
          {...getTestId([TEST_ID_ROOT, 'submitButton'])}
        >
          <p>Sign in</p>
        </Button>
      </form>
    </main>
  )
})

// MARK: Route

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/_unauthenticated/signin')({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
})
