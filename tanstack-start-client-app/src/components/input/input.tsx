import styles from './input.module.css'
import type { InputHTMLAttributes } from 'react'
import { getTestId } from '@/utils/test-ids'
import { cn } from '@/utils/tailwind-merge'

type Props = {
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  error?: string
  'data-testid'?: string
}

export const Input = ({
  inputProps,
  error,
  'data-testid': dataTestId,
}: Props) => {
  const { className, ...restInputProps } = inputProps || {}

  return (
    <div className={styles.root} {...getTestId([dataTestId, 'root'])}>
      <input
        {...restInputProps}
        className={cn(styles.input, error && styles.error, className)}
        {...getTestId([dataTestId, 'input'])}
      />

      {error && (
        <p
          className={styles.errorMessage}
          {...getTestId([dataTestId, 'errorMessage'])}
        >
          {error}
        </p>
      )}
    </div>
  )
}
