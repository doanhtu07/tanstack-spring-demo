import styles from './button.module.css'
import type { PropsWithChildren } from 'react'

const TEST_ID_ROOT = 'components.button.button'

type Props = PropsWithChildren & {
  onClick?: () => void
  'data-testid'?: string
}

export const Button = ({
  children,
  onClick,
  'data-testid': dataTestId = TEST_ID_ROOT,
}: Props) => {
  return (
    <button
      className={styles.root}
      onClick={onClick}
      data-testid={`${dataTestId}_root`}
    >
      {children}
    </button>
  )
}
