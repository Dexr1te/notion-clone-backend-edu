import { createUserSchema } from '@/schemas/user.schema'
import { createUser, getUserById } from '@/services/user.service'
import { Request, Response } from 'express'

export const getUserByIdFunction = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid user id' })
  }
  const user = await getUserById(id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(user).status(200)
}

export const createUserFunction = async (req: Request, res: Response) => {
  const validation = createUserSchema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({ message: validation.error.issues[0].message })
  }

  const newUser = await createUser(validation.data)
  res.json(newUser).status(201)
}
