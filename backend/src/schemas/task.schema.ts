import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED'])
})
