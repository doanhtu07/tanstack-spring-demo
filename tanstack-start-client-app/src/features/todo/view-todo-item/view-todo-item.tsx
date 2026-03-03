import { useEffect, useState } from 'react'
import styles from './view-todo-item.module.css'
import { getTestId } from '@/utils/test-ids'
import { Button } from '@/components/button/button'

type Props = {
  description: string
  completed: boolean
  onToggleComplete: (completed: boolean) => Promise<void>
  onDelete: () => Promise<void>
  onEdit: () => void
  isLoading: boolean
  'data-testid'?: string
}

export const ViewTodoItem = ({
  description,
  completed,
  onToggleComplete,
  onDelete,
  onEdit,
  isLoading,
  'data-testid': dataTestId,
}: Props) => {
  const [localCompleted, setLocalCompleted] = useState(completed)

  const handleToggleComplete = () => {
    setLocalCompleted(!localCompleted)
    void onToggleComplete(!localCompleted)
  }

  // MARK: Effects

  useEffect(() => {
    setLocalCompleted(completed)
  }, [completed])

  // MARK: Renderers

  const renderViewMode = () => {
    return (
      <div className={styles.root} {...getTestId([dataTestId, 'viewRoot'])}>
        <div className={styles.viewMode}>
          <div className={styles.content}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={localCompleted}
                onChange={handleToggleComplete}
                {...getTestId([dataTestId, 'checkboxInput'])}
              />
            </div>

            <div className={styles.text}>
              <p>{description}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              onClick={onEdit}
              isLoading={isLoading}
              {...getTestId([dataTestId, 'editButton'])}
            >
              <p>Edit</p>
            </Button>

            <Button
              onClick={onDelete}
              isLoading={isLoading}
              {...getTestId([dataTestId, 'deleteButton'])}
            >
              <p>Delete</p>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return renderViewMode()
}
