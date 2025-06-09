import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { parseBearer } from '../utils/bearer'

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']
  const token = parseBearer(authHeader)

  if (!token) {
    res.status(401).json({ message: 'Token not found.' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !('id' in decoded) || !('email' in decoded)) {
      res.status(403).json({ message: 'Invalid token.' })
      return
    }

    req.user = {
      id: (decoded as JwtPayload).id,
      email: (decoded as JwtPayload).email
    }

    next()
  })
}
