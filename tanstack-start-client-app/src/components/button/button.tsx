import type { PropsWithChildren } from 'react'
import { ButtonClassNames, SharedClassNames } from '@/utils/class-names'

type Props = PropsWithChildren

export const Button = ({ children }: Props) => {
  return (
    <button className={ButtonClassNames.root}>
      <p>Test click</p>
      <div className={SharedClassNames.children}>{children}</div>
    </button>
  )
}
