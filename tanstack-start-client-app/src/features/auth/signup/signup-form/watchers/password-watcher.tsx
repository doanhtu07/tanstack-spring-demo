import { useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import type { SignupFormData } from '../types'
import type { Control, UseFormTrigger } from 'react-hook-form'

type Props = {
  control: Control<SignupFormData, any, SignupFormData>
  trigger: UseFormTrigger<SignupFormData>
}

export const PasswordWatcher = ({ control, trigger }: Props) => {
  const password = useWatch({
    control,
    name: 'signinForm.formData.password',
  })

  useEffect(() => {
    trigger('confirmPassword')
  }, [password, trigger])

  return null
}
