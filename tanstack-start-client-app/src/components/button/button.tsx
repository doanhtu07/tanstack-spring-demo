import type { PropsWithChildren } from 'react'
import { ButtonClassNames, SharedClassNames } from '@/utils/class-names'

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
      className={ButtonClassNames.root}
      onClick={onClick}
      data-testid={`${dataTestId}_root`}
    >
      <div className={SharedClassNames.children}>{children}</div>
    </button>
  )
}
