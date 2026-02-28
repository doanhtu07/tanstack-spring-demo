import type { SigninFormState } from '../../signin/signin-form/types'

export type SignupFormData = {
  signinForm: SigninFormState
  confirmPassword: string
}

export type SignupFormTouched = Partial<Record<keyof SignupFormData, boolean>>

export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>

export type SignupFormState = {
  formData: SignupFormData
  touched: SignupFormTouched
  errors: SignupFormErrors
  isFormValid: boolean
  isFormDirty: boolean
}

export type SignupFormMonitorChangeFn = (formState: SignupFormState) => void
