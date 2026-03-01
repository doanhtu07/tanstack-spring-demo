import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'
import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'
import type { SigninFormState } from '@/features/auth/signin/signin-form/types'
import styles from '@/styles/signin.module.css'
import { useTheme } from '@/providers/theme-provider'
import { Button } from '@/components/button/button'
import { getTestId } from '@/utils/test-ids'
import { SigninForm } from '@/features/auth/signin/signin-form/signin-form'
import { Navbar } from '@/components/navbar/navbar'
import { useStore } from '@/providers/store-provider'

const TEST_ID_ROOT = 'signin'

const RouteComponent = observer(() => {
  const { redirect } = Route.useSearch()
  const { authStore } = useStore()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { toggleTheme } = useTheme()

  const [signinFormState, setSigninFormState] = useState<SigninFormState>()

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
  }

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
})

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/signin')({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
})
