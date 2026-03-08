import z from 'zod'
import { authenticatedFetch } from '../api/fetch'
import type { ShapeOptions } from '.'
import type { TodoResponse } from '@/orval/openAPIDefinition.schemas'

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
  (wire): TodoResponse => ({
    id: wire.id.toString(),
    description: wire.description,
    completed: wire.completed,
    ownerId: wire.owner_id.toString(),
    createdAt: wire.created_at,
    updatedAt: wire.updated_at,
  }),
)

export type TodoShape = z.infer<typeof TodoShapeSchema>

export const todoShapeStream: ShapeOptions<TodoShape> = {
  url: `${import.meta.env.VITE_SERVER_URL}/api/electric/todo/list`,
  subscribe: true,
  fetchClient: authenticatedFetch,
}
