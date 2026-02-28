export type SigninFormData = {
  email: string
  password: string
}

export type SigninFormTouched = Partial<Record<keyof SigninFormData, boolean>>

export type SigninFormErrors = Partial<Record<keyof SigninFormData, string>>

export type SigninFormState = {
  formData: SigninFormData
  touched: SigninFormTouched
  errors: SigninFormErrors
  isFormValid: boolean
  isFormDirty: boolean
}

export type SigninFormMonitorChangeFn = (formState: SigninFormState) => void
