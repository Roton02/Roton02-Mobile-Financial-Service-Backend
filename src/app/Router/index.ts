import { Router } from 'express'
import UserRouter from '../module/auth/auth.routes'
import TransactionRouter from '../module/Transaction/transaction.routes'

const router = Router()

const routers = [
  {
    path: '/',
    router: UserRouter,
  },
  {
    path: '/transaction',
    router: TransactionRouter,
  },
]

routers.forEach((route) => router.use(route.path, route.router))

export default router
