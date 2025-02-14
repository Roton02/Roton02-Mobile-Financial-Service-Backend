import config from '../../config'
import AppError from '../../error/AppError'
import { ILogin, IUser } from './auth.interface'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { user } from './auth.model'

const createUserIntroDB = async (payload: IUser) => {
  const isExist = await user.findOne({
    $or: [{ mobile: payload.mobile }, { email: payload.email }],
  })

  if (isExist) {
    throw new AppError(400, 'Account already exists')
  }
  if (payload.accountType === 'User') {
    payload.balance = 40
  } else if (payload.accountType === 'Agent') {
    payload.isActive = false
    payload.balance = 1000000
  }
  const result = await user.create(payload)
  return result
}

const loginUserIntroDb = async (payload: ILogin) => {
  const UserData = await user
    .findOne({
      $or: [{ email: payload.identifier }, { mobile: payload.identifier }],
    })
    .select('+pin')

  if (!UserData) {
    throw new AppError(401, 'User is not Found (invalid credentials)')
  }
  // console.log(UserData)
  const verifyPassword = await bcrypt.compare(payload.pin, UserData.pin)

  if (!verifyPassword) {
    throw new AppError(401, 'Invalid credentials')
  }

  if (UserData.isBlocked) {
    throw new AppError(401, 'Account is blocked')
  }
  if (UserData.isActive === false) {
    throw new AppError(401, 'Account is Deactivated')
  }

  const VerifiedUser = {
    email: UserData.email,
    name: UserData.name,
    mobile: UserData.mobile,
    accountType: UserData.accountType,
  }

  const secret = config.JWT_SECRET as string

  const token = jwt.sign(VerifiedUser, secret, { expiresIn: '2hr' })

  return { token }
}

const updateUserIntroDB = async (id: string) => {
  const result = await user.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  )
  return result
}
const updateAgentStatusIntoDB = async (id: string, status: boolean) => {
  const result = await user.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true }
  )
  return result
}

const getSingleUserIntoDB = async (mobile: string) => {
  const result = await user.findOne({ mobile }).select('-password')
  return result
}
const getUserIntroDB = async () => {
  const result = await user.find().select('-password')
  return result
}

export const userServcies = {
  createUserIntroDB,
  loginUserIntroDb,
  getUserIntroDB,
  updateUserIntroDB,
  getSingleUserIntoDB,
  updateAgentStatusIntoDB,
}
