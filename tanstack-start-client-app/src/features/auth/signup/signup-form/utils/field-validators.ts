import { z } from 'zod'

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
) => {
  const result = z
    .string()
    .trim()
    .min(1, 'Confirm password is required')
    .safeParse(confirmPassword)

  if (!result.success) {
    return result.error.issues[0]?.message
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
}
