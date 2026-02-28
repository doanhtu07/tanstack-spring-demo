import { Controller, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import styles from './signin-form.module.css'
import { defaultFormData, getFormState } from './utils/form-state'
import { validateEmail, validatePassword } from './utils/field-validators'
import type { SigninFormMonitorChangeFn } from './types'
import { getTestId } from '@/utils/test-ids'
import { Input } from '@/components/input/input'

type Props = {
  isSignup: boolean

  monitorChange?: SigninFormMonitorChangeFn
  defaultValues?: typeof defaultFormData
  triggerInitialValidation?: boolean
  disabled?: boolean

  'data-testid'?: string
}

export const SigninForm = ({
  isSignup,
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
        const formState = getFormState({ isSignup, data })
        monitorChange?.(formState)
      },
    })

    return () => {
      unsubscribe()
    }
  }, [isSignup, monitorChange, subscribe])

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
      <Controller
        control={control}
        name="email"
        rules={{
          validate: (value) => {
            return validateEmail(value) || true
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <div className={styles.field}>
              <label htmlFor="email">Email</label>

              <Input
                inputProps={{
                  id: 'email',
                  type: 'email',
                  autoComplete: 'email',
                  disabled,
                  //
                  value: field.value,
                  onChange: field.onChange,
                  onBlur: field.onBlur,
                }}
                error={disabled ? undefined : fieldState.error?.message}
                {...getTestId([dataTestId, 'email'])}
              />
            </div>
          )
        }}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          validate: (value) => {
            return validatePassword({ password: value, isSignup }) || true
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <div className={styles.field}>
              <label htmlFor="password">Password</label>

              <Input
                inputProps={{
                  id: 'password',
                  type: 'password',
                  autoComplete: 'current-password',
                  disabled,
                  //
                  value: field.value,
                  onChange: field.onChange,
                  onBlur: field.onBlur,
                }}
                error={disabled ? undefined : fieldState.error?.message}
                {...getTestId([dataTestId, 'password'])}
              />
            </div>
          )
        }}
      />
    </div>
  )
}
