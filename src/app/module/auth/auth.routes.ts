import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { userAuthValidation } from './auth.validation'
import { authControllers } from './auth.controller'

const UserRouter = Router()

UserRouter.post(
  '/auth/register',
  validateRequest(userAuthValidation.registrationValidation),
  authControllers.createUser
)
UserRouter.post(
  '/auth/login',
  validateRequest(userAuthValidation.loginValidation),
  authControllers.loginUser
)
UserRouter.patch('/auth/:ID', auth('Admin'), authControllers.updateAccount)
UserRouter.get('/users', auth('Admin'), authControllers.getUsers)

export default UserRouter
