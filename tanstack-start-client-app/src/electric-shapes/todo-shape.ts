import z from 'zod'
import { FetchError } from '@electric-sql/client'
import { authenticatedFetch } from '../api/fetch'
import type { ShapeOptions } from '.'
import type { TodoResponse } from '@/orval/openAPIDefinition.schemas'
import { getBaseUrl } from '@/api/utils'

// Inspect `electric-schema` header when calling Electric API in backend
export const TodoShapeSchema = z.object({
  id: z.union([z.bigint(), z.string(), z.number()]).transform(BigInt),
  description: z.string(),
  completed: z.boolean(),
  owner_id: z.union([z.bigint(), z.string(), z.number()]).transform(BigInt),
  created_at: z.string(),
  updated_at: z.string(),
})

export const TodoResponseSchema = TodoShapeSchema.transform(
  (shape): TodoResponse => ({
    id: shape.id.toString(),
    description: shape.description,
    completed: shape.completed,
    ownerId: shape.owner_id.toString(),
    createdAt: shape.created_at,
    updatedAt: shape.updated_at,
  }),
)

export type TodoShape = z.infer<typeof TodoShapeSchema>

export const getTodoShapeStream = (input: {
  abortController?: AbortController
  // enabled?: boolean
}): ShapeOptions<TodoShape> => ({
  url: `${getBaseUrl()}/api/electric/todo/list`,
  subscribe: true,
  fetchClient: authenticatedFetch,
  subsetMethod: 'POST',

  // this will abort polling for this shape globally (not just within the current component)
  // a quirk of Electric that needs some caution when use
  signal: input.abortController?.signal,

  // this will NOT abort everything since it will count references
  // PR: https://github.com/electric-sql/electric/pull/4071
  // enabled: input.enabled,

  onError: (error) => {
    if (
      error instanceof FetchError &&
      error.status >= 400 &&
      error.status < 500
    ) {
      // abort to prevent tab-focus refetch from restarting it
      input.abortController?.abort()

      // stop syncing permanently
      return
    }

    // for other errors, we can just return an empty object to signal Electric to retry
    return {}
  },
})
