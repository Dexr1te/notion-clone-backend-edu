import z from 'zod'

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Too small - must be at least 1 character')
    .max(255, 'Name must be less than 255 characters')
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema>
