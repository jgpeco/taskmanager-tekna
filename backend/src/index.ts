import express, { Request, Response } from 'express'

const app = express()

app.get('/health', (req: Request, res: Response) => {
  res.send('OK')
  return
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})

export default app
