import { validateConfirmPassword } from './field-validators'
import type {
  SignupFormData,
  SignupFormErrors,
  SignupFormState,
  SignupFormTouched,
} from '../types'
import type { EventType, FormState, InternalFieldName } from 'react-hook-form'
import { defaultFormData as defaultSigninFormData } from '@/features/auth/signin/signin-form/utils/form-state'

export const defaultFormData: SignupFormData = {
  signinForm: {
    formData: defaultSigninFormData,
    touched: {},
    errors: {},
    isFormValid: false,
    isFormDirty: false,
  },
  confirmPassword: '',
}

const getIsFormValid = (input: { errors: SignupFormErrors }) => {
  const { errors } = input
  return Object.values(errors).every((error) => !error)
}

export const getFormState = (
  data: Partial<FormState<SignupFormData>> & {
    values: SignupFormData
    name?: InternalFieldName
    type?: EventType
  },
): SignupFormState => {
  const formData: SignupFormData = {
    ...data.values,
  }

  const touched: SignupFormTouched = {
    confirmPassword: !!data.touchedFields?.confirmPassword,
  }

  const errors: SignupFormErrors = {
    confirmPassword: validateConfirmPassword(
      formData.signinForm.formData.password,
      formData.confirmPassword,
    ),
  }

  const isSigninFormValid = formData.signinForm.isFormValid
  const isSigninFormDirty = formData.signinForm.isFormDirty

  const isFormValid = getIsFormValid({ errors }) && isSigninFormValid

  const dirtyKeys = Object.keys(data.dirtyFields || {})
  const isMainFormDirty = dirtyKeys.some((key) => key !== 'signinForm')
  const isFormDirty = isMainFormDirty || isSigninFormDirty

  return {
    formData,
    touched,
    errors,
    isFormValid,
    isFormDirty,
  }
}
