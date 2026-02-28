import { validateEmail, validatePassword } from './field-validators'
import type { EventType, FormState, InternalFieldName } from 'react-hook-form'
import type {
  SigninFormData,
  SigninFormErrors,
  SigninFormState,
  SigninFormTouched,
} from '../types'

export const defaultFormData: SigninFormData = {
  email: '',
  password: '',
}

const getIsFormValid = (input: { errors: SigninFormErrors }) => {
  const { errors } = input
  return Object.values(errors).every((error) => !error)
}

export const getFormState = (input: {
  isSignup: boolean
  data: Partial<FormState<SigninFormData>> & {
    values: SigninFormData
    name?: InternalFieldName
    type?: EventType
  }
}): SigninFormState => {
  const { isSignup, data } = input

  const formData: SigninFormData = {
    ...data.values,
  }

  const touched: SigninFormTouched = {
    email: !!data.touchedFields?.email,
    password: !!data.touchedFields?.password,
  }

  const errors: SigninFormErrors = {
    email: validateEmail(formData.email),
    password: validatePassword({
      password: formData.password,
      isSignup,
    }),
  }

  const isFormValid = getIsFormValid({ errors })

  const dirtyKeys = Object.keys(data.dirtyFields || {})
  const isFormDirty = dirtyKeys.length > 0

  return {
    formData,
    touched,
    errors,
    isFormValid,
    isFormDirty,
  }
}
