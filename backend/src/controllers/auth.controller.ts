import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma/client'

import { registerSchema, loginSchema } from '../schemas/auth.schema'

export async function register(req: Request, res: Response): Promise<void> {
  const parse = registerSchema.safeParse(req.body)

  if (!parse.success) {
    res.status(400).json({ errors: parse.error.format() })
    return
  }

  const { email, password } = parse.data

  const userExists = await prisma.user.findUnique({ where: { email } })
  if (userExists) {
    res.status(400).json({ message: 'User already exists.' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  })

  res.status(201).json({ message: 'User sucessfuly created!', user })
}

export async function login(req: Request, res: Response): Promise<void> {
  const parse = loginSchema.safeParse(req.body)

  if (!parse.success) {
    res.status(400).json({ errors: parse.error.format() })
    return
  }

  const { email, password } = parse.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials.' })
    return
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    res.status(400).json({ message: 'Invalid credentials.' })
    return
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
  })

  res.json({ token })
}
