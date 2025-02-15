import { Router } from 'express'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { transactionValidations } from './transaction.validation'
import { transactionControllers } from './transaction.controller'

const TransactionRouter = Router()

TransactionRouter.get(
  '/getAllWithdrawRequest',
  auth('Admin'),
  transactionControllers.getAllWithdrawRequest
)
TransactionRouter.get(
  '/getAllCashRequest',
  auth('Admin'),
  transactionControllers.getAllCashRequest
)
TransactionRouter.get(
  '/totalBallances',
  auth('Admin'),
  transactionControllers.getTotalBallances
)
TransactionRouter.get(
  '/:number',
  auth('Admin'),
  transactionControllers.getsingleUserTransaction
)
TransactionRouter.get(
  '/',
  auth('Agent', 'Admin', 'User'),
  transactionControllers.getTransactions
)

TransactionRouter.post(
  '/sendMoney',
  validateRequest(transactionValidations.sendMoneyValidation),
  auth('User'),
  transactionControllers.sendMoney
)
TransactionRouter.post(
  '/cashOut',
  validateRequest(transactionValidations.cashOutInValidation),
  auth('User'),
  transactionControllers.cashOut
)
TransactionRouter.post(
  '/cashIn',
  validateRequest(transactionValidations.cashOutInValidation),
  auth('Agent'),
  transactionControllers.cashIn
)
TransactionRouter.post(
  '/cashRequest',
  auth('Agent'),
  transactionControllers.cashRequest
)
TransactionRouter.post(
  '/withdrawRequest',
  auth('Agent'),
  transactionControllers.withdrawRequest
)
TransactionRouter.patch(
  '/approveCashRequest/:id',
  auth('Admin'),
  transactionControllers.approveCashRequest
)
TransactionRouter.patch(
  '/approveWithdrawRequest/:id',
  auth('Admin'),
  transactionControllers.approveWithdrawRequest
)

export default TransactionRouter
