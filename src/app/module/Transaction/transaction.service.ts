/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import AppError from '../../error/AppError'
import { user } from '../auth/auth.model'
import { JwtPayload } from 'jsonwebtoken'
import { ITransaction } from './transaction.interface'
import { cheeckReciver } from './transaction.utils'

const sendMoney = async (payload: ITransaction, userData: JwtPayload) => {
  cheeckReciver(payload.receiverNumber)
  //TODO: check if sender has enough balance
  const sender = await user.findOne({ mobile: userData.mobile })
  if (payload.amount >= 100) {
    const moneyWithFee = payload.amount + payload.amount * 0.01
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // const senderDescrement = await
    const result = await user.findOneAndUpdate(
      { mobile: payload.receiverNumber },
      { $inc: { balance: payload.amount } },
      { session }
    )
    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(400, error.message)
  }
}

const cashOut = async (payload: ITransaction, userData: JwtPayload) => {
  const isReciverExist = await user.findOne({
    mobile: payload.receiverNumber,
  })
  if (!isReciverExist) {
    throw new Error('Receiver not found')
  }
}

export const tracsactionServices = { sendMoney, cashOut }
