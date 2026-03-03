import { useState } from 'react'
import { EditTodoItem } from '../edit-todo-item/edit-todo-item'
import { getTestId } from '@/utils/test-ids'
import { Button } from '@/components/button/button'

type Props = {
  onCreate: (data: { description: string }) => Promise<void>
  'data-testid'?: string
}

export const CreateTodoButton = ({
  onCreate,
  'data-testid': dataTestId,
}: Props) => {
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (isCreating) {
    return (
      <EditTodoItem
        description=""
        onUpdate={async (input) => {
          setIsLoading(true)

          try {
            await onCreate(input)
            setIsCreating(false)
          } catch (err) {
            console.error('CreateTodoButton onUpdate - error', err)
          } finally {
            setIsLoading(false)
          }
        }}
        onCancel={() => {
          setIsCreating(false)
        }}
        isLoading={isLoading}
        {...getTestId([dataTestId, 'createMode'])}
      />
    )
  }

  return (
    <Button
      onClick={() => setIsCreating(true)}
      {...getTestId([dataTestId, 'createButton'])}
    >
      <p>Create new todo</p>
    </Button>
  )
}
