import { CreateUserSchema } from '@/schemas/user.schema'
import { prisma } from '../lib/prisma'

export const getUserById = async (ID: number) => {
  return prisma.user.findUnique({
    where: {
      id: ID
    },
    select: {
      id: true,
      email: true
    }
  })
}

export const createUser = async (data: CreateUserSchema) => {
  return await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.password
    }
  })
}
