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
const cashRequest = catchAsync(async (req: Request, res: Response) => {
  const { user } = req as JwtPayload
  // console.log({ user })
  const body = req.body
  const result = await tracsactionServices.cashRequestIntoDB(user, body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Cash request submitted successfully!',
    data: result,
  })
})
const withdrawRequest = catchAsync(async (req: Request, res: Response) => {
  const { user } = req as JwtPayload
  // console.log({ user })
  const body = req.body
  const result = await tracsactionServices.withdrawRequestIntoDB(user, body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Withdraw request submitted successfully!',
    data: result,
  })
})
const approveCashRequest = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const body = req.body.isApproved
  const result = await tracsactionServices.approveCashRequestIntoDB(id, body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'cash Request approve successfully!',
    data: result,
  })
})
const approveWithdrawRequest = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const body = req.body.isApproved
    const result = await tracsactionServices.approveWithDrawRequestIntoDB(
      id,
      body
    )
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Withdraw request approve successfully!',
      data: result,
    })
  }
)
const getAllCashRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await tracsactionServices.getAllCashRequestIntoDB()
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'get All CashRequest successfully!',
    data: result,
  })
})
const getAllWithdrawRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await tracsactionServices.getAllWithdrawRequestIntoDB()
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'get All withdraw successfully!',
      data: result,
    })
  }
)

export const transactionControllers = {
  sendMoney,
  cashOut,
  cashIn,
  getTransactions,
  getsingleUserTransaction,
  cashRequest,
  withdrawRequest,
  approveWithdrawRequest,
  approveCashRequest,
  getAllCashRequest,
  getAllWithdrawRequest,
}
