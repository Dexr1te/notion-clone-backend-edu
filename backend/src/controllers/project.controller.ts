import { Request, Response } from 'express'
import { getAllProjects, createProject } from '../services/project.service.js'
import { createProjectSchema } from '@/schemas/project.schema.js'

export const getProjects = (req: Request, res: Response) => {
  const projects = getAllProjects()
  res.json(projects).status(200)
}

export const createProjects = (req: Request, res: Response) => {
  const validation = createProjectSchema.text.safeParse(req.body?.text)

  if (!validation.success) {
    return res.status(400).json({ message: validation.error.issues[0].message })
  }

  const project = req.body
  const newProject = createProject(project)
  res.json(newProject).status(201)
}
