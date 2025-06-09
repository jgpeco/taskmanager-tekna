import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { parseBearer } from '../utils/bearer'

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = parseBearer(authHeader)

  if (!token) return res.status(401).json({ message: 'Token not found.' })

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' })
    req.user = user
    next()
  })
}
