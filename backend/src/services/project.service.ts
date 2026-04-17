import { CreateProjectSchema } from '@/schemas/project.schema'
import { prisma } from '../lib/prisma'

export const getAllProjects = async () => {
  return await prisma.project.findMany()
}

export const createProject = async (
  data: CreateProjectSchema,
  ownerId: number
) => {
  return await prisma.project.create({
    data: {
      name: data.name,
      ownerId
    }
  })
}
