import { observer } from 'mobx-react-lite'
import { useQueryClient } from '@tanstack/react-query'
import { CustomLink } from '../../components/custom-link/custom-link'
import styles from './navbar.module.css'
import type { CurrentUserResponse } from '@/orval/openAPIDefinition.schemas'
import { getTestId } from '@/utils/test-ids'
import { useStore } from '@/providers/store-provider'
import { useGetCurrentUser } from '@/orval/auth-controller'
import { Divider } from '@/components/divider/divider'
import { Button } from '@/components/button/button'
import { useTheme } from '@/providers/theme-provider'

type Props = {
  user?: CurrentUserResponse
  hideHome?: boolean
  hideApp?: boolean
  hideSignin?: boolean
  hideSignup?: boolean
  'data-testid'?: string
}

export const Navbar = observer(
  ({
    user: inputUser,
    hideHome,
    hideApp,
    hideSignin,
    hideSignup,
    'data-testid': dataTestId,
  }: Props) => {
    const { authStore } = useStore()
    const queryClient = useQueryClient()
    const { toggleTheme } = useTheme()

    const { data: cachedUser, isError } = useGetCurrentUser({
      query: {
        enabled: !inputUser,
        staleTime: 1000 * 60,
        retry: false,
        refetchOnWindowFocus: false,
      },
    })

    const currentUser = inputUser || (isError ? undefined : cachedUser)

    // MARK: Renderers

    return (
      <nav className={styles.root} {...getTestId([dataTestId, 'root'])}>
        <div
          className={styles.linkContainer}
          {...getTestId([dataTestId, 'linkContainer'])}
        >
          {!hideHome && (
            <CustomLink to="/" {...getTestId([dataTestId, 'homeLink'])}>
              <p>Back home</p>
            </CustomLink>
          )}

          {!hideApp && currentUser && (
            <CustomLink to="/app" {...getTestId([dataTestId, 'appLink'])}>
              <p>App</p>
            </CustomLink>
          )}

          {!hideSignin && !currentUser && (
            <CustomLink to="/signin" {...getTestId([dataTestId, 'signinLink'])}>
              <p>Sign in</p>
            </CustomLink>
          )}

          {!hideSignup && !currentUser && (
            <CustomLink to="/signup" {...getTestId([dataTestId, 'signupLink'])}>
              <p>Sign up</p>
            </CustomLink>
          )}

          {currentUser && (
            <CustomLink
              onClick={() => {
                authStore.signout({ queryClient }).then()
              }}
              {...getTestId([dataTestId, 'logoutLink'])}
            >
              <p>Sign out</p>
            </CustomLink>
          )}

          <Button
            onClick={() => toggleTheme()}
            {...getTestId([dataTestId, 'toggleTheme'])}
          >
            <p>Toggle theme</p>
          </Button>
        </div>

        <Divider />
      </nav>
    )
  },
)
