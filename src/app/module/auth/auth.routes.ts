import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { userAuthValidation } from './auth.validation'
import { authControllers } from './auth.controller'

const UserRouter = Router()

UserRouter.get('/auth/verify-token', authControllers.verifyToken)
UserRouter.post('/auth/logout', authControllers.logOut)
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
UserRouter.patch(
  '/AgentStatus/:ID',
  auth('Admin'),
  authControllers.updateAgentStatus
)
UserRouter.get('/users/:Number', authControllers.getSingleUsers)
UserRouter.get('/users', auth('Admin'), authControllers.getUsers)

export default UserRouter
