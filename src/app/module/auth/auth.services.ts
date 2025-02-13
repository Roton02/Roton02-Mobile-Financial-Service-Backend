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
    throw new AppError(401, 'User is not Found P(invalid credentials)')
  }
  // console.log(UserData)
  const verifyPassword = await bcrypt.compare(payload.pin, UserData.pin)

  if (!verifyPassword) {
    throw new AppError(401, 'Invalid credentials')
  }

  const VerifiedUser = {
    email: UserData.email,
    name: UserData.name,
    mobile: UserData.mobile,
  }

  const secret = config.JWT_SECRET as string

  const token = jwt.sign(VerifiedUser, secret, { expiresIn: '1d' })

  return { token }
}

const getUserIntroDB = async () => {
  const result = await user.find().select('-password')
  return result
}

export const userServcies = {
  createUserIntroDB,
  loginUserIntroDb,
  getUserIntroDB,
}
