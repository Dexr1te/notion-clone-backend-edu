import { Router } from 'express'
import { logger } from '../middleware/project.middleware'
import { getAllTaskByProjectId } from '@/services/task.service'
import { createTaskFunction } from '@/controllers/task.controller'

const router = Router()

router.get('/:id', logger, getAllTaskByProjectId)
router.post('/', logger, createTaskFunction)

export default router
