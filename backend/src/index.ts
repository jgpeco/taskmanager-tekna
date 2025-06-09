import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'

dotenv.config()
const app = express()

app.use(express.json())
app.use('/auth', authRoutes)

app.get('/health', (req: Request, res: Response) => {
  res.send('OK')
  return
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})

export default app
