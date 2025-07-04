import { z } from 'zod'

export const taskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(2, { message: 'Title must be at least 2 characters long' }),
  status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED'])
})
