import { Router } from 'express'
import { logger } from '../middleware/project.middleware.js'
import {
  getProjects,
  createProjects
} from '../controllers/project.controller.js'

const router = Router()

router.get('/', logger, getProjects)
router.post('/', logger, createProjects)

export default router
