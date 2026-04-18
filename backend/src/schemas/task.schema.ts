import z from 'zod'

export const createTaskSchema = z.object({
  title: z.string().max(100, 'Title must be at most 100 characters long'),
  description: z
    .string()
    .max(200, 'Description must be at most 200 characters long'),
  projectId: z.number()
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>
