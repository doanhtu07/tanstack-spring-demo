import type { useShape } from '@electric-sql/react'

export type ShapeOptions<T> = Parameters<
  typeof useShape<T & { [key: string]: unknown }>
>[0]
