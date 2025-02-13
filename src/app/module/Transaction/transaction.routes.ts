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
TransactionRouter.post(
  '/cashOut',
  validateRequest(transactionValidations.cashOutValidation),
  auth('User'),
  transactionControllers.cashOut
)
TransactionRouter.post(
  '/cashIn',
  validateRequest(transactionValidations.cashOutValidation),
  auth('Agent'),
  transactionControllers.cashOut
)

export default TransactionRouter
