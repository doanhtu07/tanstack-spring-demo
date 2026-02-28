import { z } from 'zod'

export const validateEmail = (email: string) => {
  const result = z
    .string()
    .trim()
    .min(1, 'Email is required')
    .pipe(z.email('Invalid email format'))
    .safeParse(email)

  if (!result.success) {
    return result.error.issues[0]?.message
  }
}

export const validatePassword = (password: string) => {
  const result = z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .safeParse(password)

  if (!result.success) {
    return result.error.issues[0]?.message
  }
}
