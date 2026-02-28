import styles from './button.module.css'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { getTestId } from '@/utils/test-ids'
import { cn } from '@/utils/tailwind-merge'

type Props = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    'data-testid'?: string
  }

export const Button = ({
  children,
  className,
  'data-testid': dataTestId,
  ...rest
}: Props) => {
  return (
    <button
      {...rest}
      className={cn(styles.root, className)}
      {...getTestId([dataTestId, 'root'])}
    >
      {children}
    </button>
  )
}
