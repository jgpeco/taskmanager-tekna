import { Router } from 'express'
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller'
import { authenticateToken } from '../middlewares/auth'

const router = Router()

router.use(authenticateToken) // todas as rotas exigem auth

router.get('/tasks', listTasks)
router.get('/tasks/:id', getTask)
router.post('/tasks', createTask)
router.put('/tasks/:id', updateTask)
router.delete('/tasks/:id', deleteTask)

export default router
