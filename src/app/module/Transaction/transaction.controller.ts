import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { tracsactionServices } from './transaction.service'
import { JwtPayload } from 'jsonwebtoken'

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const { user } = req as JwtPayload
  // console.log({ user })
  const result = await tracsactionServices.sendMoney(payload, user)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Money sent successfully',
    data: result,
  })
})
const cashOut = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const { user } = req as JwtPayload
  // console.log({ user })
  const result = await tracsactionServices.cashOut(payload, user)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Money sent successfully',
    data: result,
  })
})
const cashIn = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const { user } = req as JwtPayload
  // console.log({ user })
  const result = await tracsactionServices.cashIn(payload, user)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Money sent successfully',
    data: result,
  })
})
const getsingleUserTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const number = req.params.number
    // console.log({ user })
    const result =
      await tracsactionServices.getsingleUserTransactionIntoDB(number)
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Transaction retrieved successfully',
      data: result,
    })
  }
)
const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const { user } = req as JwtPayload
  // console.log({ user })
  const result = await tracsactionServices.getTransactionsIntoDB(user)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Transaction retrieved successfully',
    data: result,
  })
})

export const transactionControllers = {
  sendMoney,
  cashOut,
  cashIn,
  getTransactions,
  getsingleUserTransaction,
}
