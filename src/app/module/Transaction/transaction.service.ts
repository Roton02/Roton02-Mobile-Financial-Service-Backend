/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import AppError from '../../error/AppError'
import { user } from '../auth/auth.model'
import { JwtPayload } from 'jsonwebtoken'
import { ITransaction } from './transaction.interface'
import { ADMIN_MOBILE } from './transaction.const'
import bcrypt from 'bcryptjs'

const sendMoney = async (payload: ITransaction, userData: JwtPayload) => {
  // check Receiver
  const receiver = await user.findOne({ mobile: payload.receiverNumber })
  if (!receiver) {
    throw new AppError(404, 'Receiver not found')
  }

  // check Sender
  const sender = await user.findOne({ mobile: userData.mobile })
  if (!sender) {
    throw new AppError(404, 'Sender not found')
  }

  // ✅ সর্বনিম্ন ৫০ টাকা পাঠানো যাচ্ছি কি না চেক করুন
  if (payload.amount < 50) {
    throw new AppError(400, 'Minimum send amount is 50 Taka')
  }

  // ✅ ১০০ টাকার বেশি হলে ফি যোগ করুন
  const sendFee = payload.amount >= 100 ? 5 : 0
  const totalAmount = payload.amount + sendFee

  // ✅ Sender এর কাছে পর্যাপ্ত ব্যালান্স আছে কিনা চেক করুন
  if (sender.balance! < totalAmount) {
    throw new AppError(400, 'Insufficient balance')
  }

  // ✅ MongoDB Transaction শুরু করুন
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    // ✅ Sender থেকে টাকা কেটে নিন
    await user.findOneAndUpdate(
      { mobile: sender.mobile },
      { $inc: { balance: -totalAmount } },
      { session }
    )

    // ✅ Receiver এর ব্যালান্স বাড়িয়ে দিন
    await user.findOneAndUpdate(
      { mobile: receiver.mobile },
      { $inc: { balance: payload.amount } },
      { session }
    )

    // ✅ Admin এর অ্যাকাউন্টে ৫ টাকা জমা করুন (যদি applicable হয়)
    if (sendFee > 0) {
      await user.findOneAndUpdate(
        { mobile: ADMIN_MOBILE },
        { $inc: { balance: sendFee } },
        { session }
      )
    }

    // ✅ Transaction কমিট করুন
    await session.commitTransaction()
    await session.endSession()

    return { message: 'Transaction successful', amount: payload.amount }
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(400, error.message)
  }
}

export const tracsactionServices = { sendMoney, cashOut }
