import express, { Request, Response } from 'express'
import router from './app/Router'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'
const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'welcome to Zin-Chat Application ',
  })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
