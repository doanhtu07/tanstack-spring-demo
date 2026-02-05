import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export const Button = ({ children }: Props) => {
  return (
    <button className="button">
      <p>Test click</p>
      <div className="children">{children}</div>
    </button>
  )
}
