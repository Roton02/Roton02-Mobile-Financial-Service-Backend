import { Router } from 'express'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { transactionValidations } from './transaction.validation'
import { transactionControllers } from './transaction.controller'

const TransactionRouter = Router()

TransactionRouter.post(
  '/sendMoney',
  validateRequest(transactionValidations.sendMoneyValidation),
  auth('User'),
  transactionControllers.sendMoney
)

export default TransactionRouter
