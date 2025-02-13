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

export const transactionControllers = { sendMoney }
