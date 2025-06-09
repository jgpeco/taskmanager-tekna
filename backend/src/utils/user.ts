import { Request, Response } from 'express'

function getUserId(req: Request, res: Response) {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: 'Unauthorized: user not found in request' })
    return null
  }

  return req.user.id
}

export { getUserId }
