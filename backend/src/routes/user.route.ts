import { Router } from 'express'
import { logger } from '../middleware/project.middleware.js'
import {
  createUserFunction,
  getUserByIdFunction
} from '@/controllers/user.controller.js'

const router = Router()

router.get('/:id', logger, getUserByIdFunction)
router.post('/', logger, createUserFunction)

export default router
