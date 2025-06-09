import { z } from 'zod'

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .transform((email) => email.toLowerCase().trim()),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' })
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),

  password: z.string({ required_error: 'Password is required' })
})
