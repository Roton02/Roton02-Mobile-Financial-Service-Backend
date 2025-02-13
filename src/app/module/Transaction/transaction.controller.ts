import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { tracsactionServices } from './transaction.service'

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const result = await tracsactionServices.sendMoney(payload)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Money sent successfully',
    data: result,
  })
})

export const transactionControllers = { sendMoney }
