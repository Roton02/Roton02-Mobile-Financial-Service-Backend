import { Router } from 'express'
import UserRouter from '../module/auth/auth.routes'

const router = Router()

const routers = [
  {
    path: '/',
    router: UserRouter,
  },
]

routers.forEach((route) => router.use(route.path, route.router))

export default router
