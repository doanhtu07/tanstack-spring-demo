import { CustomLink } from '../custom-link/custom-link'
import styles from './navbar.module.css'
import { getTestId } from '@/utils/test-ids'

type Props = {
  hideHome?: boolean
  hideSignin?: boolean
  hideSignup?: boolean
  'data-testid'?: string
}

export const Navbar = ({
  hideHome,
  hideSignin,
  hideSignup,
  'data-testid': dataTestId,
}: Props) => {
  return (
    <div className={styles.root} {...getTestId([dataTestId, 'root'])}>
      {!hideHome && (
        <CustomLink to="/" {...getTestId([dataTestId, 'homeLink'])}>
          <p>Back home</p>
        </CustomLink>
      )}

      {!hideSignin && (
        <CustomLink to="/signin" {...getTestId([dataTestId, 'signinLink'])}>
          <p>Sign in</p>
        </CustomLink>
      )}

      {!hideSignup && (
        <CustomLink to="/signup" {...getTestId([dataTestId, 'signupLink'])}>
          <p>Sign up</p>
        </CustomLink>
      )}
    </div>
  )
}
