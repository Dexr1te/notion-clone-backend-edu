import { Request, Response } from 'express'
import { getAllProjects, createProject } from '../services/project.service'
import { createProjectSchema } from '@/schemas/project.schema'

export const getProjects = (req: Request, res: Response) => {
  const projects = getAllProjects()
  res.json(projects).status(200)
}

export const createProjects = async (req: Request, res: Response) => {
  const validation = createProjectSchema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({ message: validation.error.issues[0].message })
  }

  const newProject = await createProject(validation.data, 1)
  res.json(newProject).status(201)
}
