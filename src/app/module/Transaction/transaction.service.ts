/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import AppError from '../../error/AppError'
import { user } from '../auth/auth.model'
import { ISendMoney } from './transaction.interface'

const sendMoney = async (payload: ISendMoney) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const isReciverExist = await user.findOne({
      mobile: payload.receiverNumber,
    })
    if (!isReciverExist) {
      throw new Error('Receiver not found')
    }
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

export const tracsactionServices = { sendMoney }
