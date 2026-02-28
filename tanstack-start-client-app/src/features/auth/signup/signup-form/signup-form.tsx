import { Controller, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { SigninForm } from '../../signin/signin-form/signin-form'
import styles from './signup-form.module.css'
import { defaultFormData, getFormState } from './utils/form-state'
import { validateConfirmPassword } from './utils/field-validators'
import { PasswordWatcher } from './watchers/password-watcher'
import type { SignupFormMonitorChangeFn } from './types'
import { getTestId } from '@/utils/test-ids'
import { Input } from '@/components/input/input'

type Props = {
  monitorChange?: SignupFormMonitorChangeFn
  defaultValues?: typeof defaultFormData
  triggerInitialValidation?: boolean
  disabled?: boolean
  'data-testid'?: string
}

export const SignupForm = ({
  monitorChange,
  defaultValues,
  triggerInitialValidation,
  disabled,
  'data-testid': dataTestId,
}: Props) => {
  const { control, subscribe, reset, trigger } = useForm({
    defaultValues: defaultValues || defaultFormData,
    mode: 'all',
  })

  const initDefaultValues = useRef(false)

  const [focusedFields, setFocusedFields] = useState<
    Partial<Record<'confirmPassword', true>>
  >({})

  // MARK: Effects

  // Effect: Monitor form changes
  useEffect(() => {
    const unsubscribe = subscribe({
      formState: {
        values: true,
        touchedFields: true,
        dirtyFields: true,
      },
      callback: (data) => {
        const formState = getFormState(data)
        monitorChange?.(formState)
      },
    })

    return () => {
      unsubscribe()
    }
  }, [monitorChange, subscribe])

  // Effect: Initialize form values + trigger initial validation (if needed)
  useEffect(() => {
    if (initDefaultValues.current) return

    initDefaultValues.current = true

    if (defaultValues) {
      reset(defaultValues)
    }

    if (triggerInitialValidation) {
      // Push trigger() to the end of current execution cycle
      // So reset() finishes processing first
      Promise.resolve().then(() => trigger())
    }
  }, [defaultValues, reset, trigger, triggerInitialValidation])

  // MARK: Renderers

  return (
    <div className={styles.root} {...getTestId([dataTestId, 'root'])}>
      <PasswordWatcher control={control} trigger={trigger} />

      <Controller
        control={control}
        name="signinForm"
        render={({ field }) => {
          return (
            <SigninForm
              monitorChange={(formState) => {
                field.onChange(formState)
              }}
              defaultValues={defaultValues?.signinForm.formData}
              triggerInitialValidation={triggerInitialValidation}
              disabled={disabled}
              {...getTestId([dataTestId, 'signinForm'])}
            />
          )
        }}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          validate: (value, formValues) => {
            // Don't validate confirmPassword until:
            // - triggerInitialValidation is true
            // - It's focused for the first time
            if (!triggerInitialValidation && !focusedFields.confirmPassword) {
              return true
            }

            return (
              validateConfirmPassword(
                formValues.signinForm.formData.password,
                value,
              ) || true
            )
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm password</label>

              <Input
                inputProps={{
                  id: 'confirmPassword',
                  type: 'password',
                  disabled,
                  value: field.value,
                  onChange: field.onChange,
                  onBlur: field.onBlur,
                  onFocus: () => {
                    setFocusedFields((prev) => {
                      if (prev.confirmPassword) return prev

                      return {
                        ...prev,
                        confirmPassword: true,
                      }
                    })
                  },
                }}
                error={disabled ? undefined : fieldState.error?.message}
                {...getTestId([dataTestId, 'confirmPassword'])}
              />
            </div>
          )
        }}
      />
    </div>
  )
}
