import { useState } from 'react'
import { EditTodoItem } from '../edit-todo-item/edit-todo-item'
import { ViewTodoItem } from '../view-todo-item/view-todo-item'
import { getTestId } from '@/utils/test-ids'

type Props = {
  description: string
  completed: boolean
  onUpdate: (data: { description: string }) => Promise<void>
  onToggleComplete: (completed: boolean) => Promise<void>
  onDelete: () => Promise<void>
  'data-testid'?: string
}

export const TodoItem = ({
  description,
  completed,
  onUpdate,
  onToggleComplete,
  onDelete,
  'data-testid': dataTestId,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (isEditing) {
    return (
      <EditTodoItem
        description={description}
        onUpdate={async (input) => {
          setIsLoading(true)

          try {
            await onUpdate(input)
            setIsEditing(false)
          } catch (err) {
            console.error('TodoItem onUpdate - error', err)
          } finally {
            setIsLoading(false)
          }
        }}
        onCancel={() => {
          setIsEditing(false)
        }}
        isLoading={isLoading}
        {...getTestId([dataTestId, 'editMode'])}
      />
    )
  }

  return (
    <ViewTodoItem
      description={description}
      completed={completed}
      onToggleComplete={async (newCompleted) => {
        setIsLoading(true)

        try {
          await onToggleComplete(newCompleted)
        } catch (err) {
          console.error('TodoItem onToggleComplete - error', err)
        } finally {
          setIsLoading(false)
        }
      }}
      onDelete={async () => {
        setIsLoading(true)

        try {
          await onDelete()
        } catch (err) {
          console.error('TodoItem onDelete - error', err)
        } finally {
          setIsLoading(false)
        }
      }}
      onEdit={() => {
        setIsEditing(true)
      }}
      isLoading={isLoading}
      {...getTestId([dataTestId, 'viewMode'])}
    />
  )
}
