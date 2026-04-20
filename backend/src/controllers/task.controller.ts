import { Request, Response } from 'express'
import { createTask, getAllTaskByProjectId } from '@/services/task.service'
import { createTaskSchema } from '@/schemas/task.schema'

export const getProjects = (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const projects = getAllTaskByProjectId(id)
  res.json(projects).status(200)
}

export const createTaskFunction = async (req: Request, res: Response) => {
  const validation = createTaskSchema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({ message: validation.error.issues[0].message })
  }

  const newProject = await createTask(validation.data)
  res.json(newProject).status(200)
}
