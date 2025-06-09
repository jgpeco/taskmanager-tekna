import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { parseBearer } from '../utils/bearer'

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> | void {
  const authHeader = req.headers['authorization']
  const token = parseBearer(authHeader)

  if (!token) {
    res.status(401).json({ message: 'Token not found.' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' })
    console.log('req user', user)
    req.user = user
    next()
  })
}
