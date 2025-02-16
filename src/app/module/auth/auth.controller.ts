import { Request, Response } from 'express'
import { userServcies } from './auth.services'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import AppError from '../../error/AppError'

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const result = await userServcies.createUserIntroDB(payload)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  })
})
const logOut = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logout successfully',
    data: '',
  })
})
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const { token } = await userServcies.loginUserIntroDb(payload)

  res.cookie('token', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Login successfully',
    data: token,
  })
})
const verifyToken = catchAsync(async (req: Request, res: Response) => {
  // const token = req.cookies.token
  const { token } = req.cookies

  if (!token) {
    throw new AppError(404, 'You are not authorized to access this route')
  }
  const result = await userServcies.verifyTokenIntroDB(token)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User retrived successfully',
    data: result,
  })
})
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServcies.getUserIntroDB()
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User retrived successfully',
    data: result,
  })
})
const getSingleUsers = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.Number
  const result = await userServcies.getSingleUserIntoDB(id)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User retrived successfully',
    data: result,
  })
})
const updateAccount = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.ID
  const result = await userServcies.updateUserIntroDB(id)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User update successfully',
    data: result,
  })
})
const updateAgentStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.ID
  const status = req.body.isActive
  // console.log({ status })
  const result = await userServcies.updateAgentStatusIntoDB(id, status)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User update successfully',
    data: result,
  })
})

export const authControllers = {
  createUser,
  loginUser,
  getUsers,
  updateAccount,
  getSingleUsers,
  updateAgentStatus,
  verifyToken,
  logOut,
}
