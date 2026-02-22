import { useEffect, useState } from 'react'
import { reaction } from 'mobx'

export function useReadMobXValue<T>(trackFn: () => T): T {
  const [value, setValue] = useState<T>(trackFn)

  useEffect(
    () => {
      return reaction(trackFn, (newValue) => setValue(newValue))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return value
}
