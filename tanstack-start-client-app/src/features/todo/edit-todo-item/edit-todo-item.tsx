import { useEffect, useState } from 'react'
import styles from './edit-todo-item.module.css'
import { getTestId } from '@/utils/test-ids'
import { Button } from '@/components/button/button'
import { Input } from '@/components/input/input'

type Props = {
  description: string
  onUpdate: (data: { description: string }) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  'data-testid'?: string
}

export const EditTodoItem = ({
  description,
  onUpdate,
  onCancel,
  isLoading,
  'data-testid': dataTestId,
}: Props) => {
  const [localDescription, setLocalDescription] = useState(description)

  // MARK: Handlers

  const handleSave = () => {
    if (localDescription.trim()) {
      void onUpdate({ description: localDescription })
    }
  }

  // MARK: Effects

  useEffect(() => {
    setLocalDescription(description)
  }, [description])

  // MARK: Renderers

  const renderEditMode = () => {
    return (
      <div className={styles.root} {...getTestId([dataTestId, 'editRoot'])}>
        <div className={styles.editMode}>
          <Input
            inputProps={{
              value: localDescription,
              onChange: (e) => setLocalDescription(e.target.value),
              placeholder: 'What needs to be done?',
              disabled: isLoading,
            }}
            {...getTestId([dataTestId, 'descriptionInput'])}
          />

          <div className={styles.actions}>
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              disabled={
                !localDescription.trim() || localDescription === description
              }
              {...getTestId([dataTestId, 'saveButton'])}
            >
              <p>Save</p>
            </Button>

            <Button
              onClick={onCancel}
              isLoading={isLoading}
              {...getTestId([dataTestId, 'cancelButton'])}
            >
              <p>Cancel</p>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return renderEditMode()
}
