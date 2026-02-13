import styles from './button.module.css'
import type { PropsWithChildren } from 'react'
import { getTestId } from '@/utils/test-ids'

type Props = PropsWithChildren & {
  onClick?: () => void
  'data-testid'?: string
}

export const Button = ({
  children,
  onClick,
  'data-testid': dataTestId,
}: Props) => {
  return (
    <button
      className={styles.root}
      onClick={onClick}
      {...getTestId([dataTestId, 'root'])}
    >
      {children}
    </button>
  )
}
