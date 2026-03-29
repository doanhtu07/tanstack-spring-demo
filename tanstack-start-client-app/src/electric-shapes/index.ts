import type { Row } from '@electric-sql/client'
import type { useShape } from '@electric-sql/react'

export type ShapeOptions<T extends Row<unknown> = Row> = Parameters<
  typeof useShape<T>
>[0]
