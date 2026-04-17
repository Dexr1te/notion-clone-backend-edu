import z from 'zod'

export const createProjectSchema = {
  text: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
}
