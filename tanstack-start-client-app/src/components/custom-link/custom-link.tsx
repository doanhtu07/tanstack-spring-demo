import { Link } from '@tanstack/react-router'
import styles from './custom-link.module.css'
import type { LinkComponentProps } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { cn } from '@/utils/tailwind-merge'
import { getTestId } from '@/utils/test-ids'

type Props = PropsWithChildren &
  LinkComponentProps & {
    'data-testid'?: string
  }

export const CustomLink = ({
  children,
  className,
  'data-testid': dataTestId,
  ...props
}: Props) => {
  return (
    <Link
      {...props}
      className={cn(styles.root, className)}
      {...getTestId([dataTestId, 'root'])}
    >
      {children}
    </Link>
  )
}
