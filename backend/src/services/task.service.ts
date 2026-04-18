import { prisma } from '../lib/prisma'
import { CreateTaskSchema } from '@/schemas/task.schema'

export const getAllTaskByProjectId = async (id: number) => {
  return await prisma.task.findMany({
    where: { projectId: id }
  })
}

export const createTask = async (data: CreateTaskSchema) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      projectId: data.projectId,
      description: data.description
    }
  })
}
