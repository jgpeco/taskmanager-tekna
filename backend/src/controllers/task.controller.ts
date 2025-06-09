import { Request, Response } from 'express'
import { prisma } from '../prisma/client'

import { taskSchema } from '../schemas/task.schema'
import { getUserId } from '../utils/user'

export const listTasks = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req, res)
  if (!userId) return

  const tasks = await prisma.task.findMany({ where: { userId } })
  res.json(tasks)
}

export const getTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const userId = getUserId(req, res)
  if (!userId) return

  const task = await prisma.task.findUnique({
    where: { id: Number(id) }
  })

  if (!task || task.userId !== userId) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  res.json(task)
}

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(req, res)
  if (!userId) return

  const parsed = taskSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json(parsed.error)
    return
  }

  const task = await prisma.task.create({
    data: {
      ...parsed.data,
      userId
    }
  })

  res.status(201).json(task)
}

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const userId = getUserId(req, res)
  if (!userId) return

  const task = await prisma.task.findUnique({ where: { id: Number(id) } })
  if (!task || task.userId !== userId) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  const parsed = taskSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json(parsed.error)
    return
  }

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: parsed.data
  })

  res.json(updated)
}

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const userId = getUserId(req, res)
  if (!userId) return

  const task = await prisma.task.findUnique({ where: { id: Number(id) } })
  if (!task || task.userId !== userId) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  await prisma.task.delete({ where: { id: Number(id) } })
  res.status(204).send()
}
