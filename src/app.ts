import express, { Request, Response } from 'express'
import router from './app/Router'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'
import cors from 'cors'
const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
  origin: 'http://localhost:5000',
  credentials: true,
}
app.use(cors(corsOptions))

app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'welcome Mobile Financial Service Application ',
  })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
