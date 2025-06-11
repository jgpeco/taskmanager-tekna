import { Request, Response } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'
import { taskSchema } from '../schemas/task.schema'
import { getUserId } from '../utils/user'

const prisma = new PrismaClient()

const validateAndParseId = (idParam: string, res: Response): number | null => {
  const id = parseInt(idParam, 10)

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'Invalid task ID provided.' })
    return null
  }

  return id
}

export const listTasks = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req, res)
  if (!userId) return

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    })
    res.json(tasks)
  } catch (error) {
    console.error('Error listing tasks:', error)
    res.status(500).json({ message: 'Internal server error while fetching tasks.' })
  }
}

export const getTask = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req, res)
  if (!userId) return

  const taskId = validateAndParseId(req.params.id, res)
  if (taskId === null) return

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    })

    if (!task || task.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized access.' })
      return
    }

    res.json(task)
  } catch (error) {
    console.error(`Error getting task ${taskId}:`, error)
    res.status(500).json({ message: 'Internal server error while retrieving task.' })
  }
}

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req, res)
  if (!userId) return

  const parsed = taskSchema.safeParse(req.body)
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: 'Validation error', errors: parsed.error.issues || parsed.error })
    return
  }

  try {
    const task = await prisma.task.create({
      data: {
        ...parsed.data,
        userId
      }
    })
    res.status(201).json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ message: 'Internal server error while creating task.' })
  }
}

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req, res)
  if (!userId) return

  const taskId = validateAndParseId(req.params.id, res)
  if (taskId === null) return

  const parsed = taskSchema.safeParse(req.body)
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: 'Validation error', errors: parsed.error.issues || parsed.error })
    return
  }

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task || task.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized access.' })
      return
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: parsed.data
    })
    res.json(updatedTask)
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: 'Task not found for update.' })
      return
    }

    res.status(500).json({ message: 'Internal server error while updating task.' })
  }
}

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req, res)
  if (!userId) return

  const taskId = validateAndParseId(req.params.id, res)
  if (taskId === null) return

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task || task.userId !== userId) {
      res.status(404).json({ message: 'Task not found or unauthorized access.' })
      return
    }

    await prisma.task.delete({ where: { id: taskId } })
    res.status(204).send()
  } catch (error: any) {
    console.error(`Error deleting task ${taskId}:`, error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: 'Task not found for deletion.' })
      return
    }
    res.status(500).json({ message: 'Internal server error while deleting task.' })
  }
}
