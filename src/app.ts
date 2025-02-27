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

app.use(
  cors({
    origin: [
      'https://flex-pay-omega.vercel.app',
      'http://localhost:5173', // আপনার ফ্রন্টএন্ড ডোমেইন এখানে দিন
      // অন্যান্য ডোমেইনও যদি থাকে, সেগুলিও এখানে যোগ করুন
    ],
    credentials: true, // কুকি বা অন্যান্য ক্রেডেনশিয়ালস পাঠানোর জন্য
  })
)

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
