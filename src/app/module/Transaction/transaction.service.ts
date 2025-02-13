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
  if (receiver.isBlocked) {
    throw new AppError(400, 'Receiver account is blocked')
  }
  // check Sender
  const sender = await user.findOne({ mobile: userData.mobile })
  if (!sender) {
    throw new AppError(404, 'Sender not found')
  }
  if (sender.isBlocked) {
    throw new AppError(400, 'Sender account is blocked')
  }
  const isPinMatch = await bcrypt.compare(payload.pin, sender.pin)
  if (!isPinMatch) {
    throw new AppError(401, 'Invalid PIN')
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

const cashOut = async (payload: ITransaction, userData: JwtPayload) => {
  // User check kora lagbe
  const sender = await user.findOne({ mobile: userData.mobile }).select('+pin')
  if (!sender) {
    throw new AppError(404, 'User not found')
  }
  if (sender.isBlocked) {
    throw new AppError(400, 'Sender account is blocked')
  }

  // Pin ki thik ace ni ?
  const isPinMatch = await bcrypt.compare(payload.pin, sender.pin)
  if (!isPinMatch) {
    throw new AppError(401, 'Invalid PIN')
  }

  // Agent achi naki ?
  const agent = await user.findOne({ mobile: payload.receiverNumber })
  if (!agent || agent.accountType !== 'Agent') {
    throw new AppError(400, 'Cash-out sudu agent diye parben ')
  }
  if (agent.isBlocked) {
    throw new AppError(400, 'agent account is blocked')
  }

  // TK ache ni
  if (sender.balance! < payload.amount) {
    throw new AppError(400, 'Insufficient balance')
  }

  // total 1.5% , tar modde agent pabe 1% r admin paibo 0.5%
  const cashOutFee = payload.amount * 0.015
  const agentIncome = payload.amount * 0.01
  const adminIncome = payload.amount * 0.005
  const totalDeduction = payload.amount + cashOutFee

  // transaction and roolback
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // decrement user ballanse
    await user.findOneAndUpdate(
      { mobile: userData.mobile },
      { $inc: { balance: -totalDeduction } },
      { session }
    )

    //increment agent ballance
    await user.findOneAndUpdate(
      { mobile: payload.receiverNumber },
      { $inc: { balance: payload.amount, income: agentIncome } },
      { session }
    )

    // add income in admin
    await user.findOneAndUpdate(
      { accountType: 'Admin' },
      { $inc: { balance: adminIncome } },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    return { message: 'Cash-out successful' }
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(400, error.message)
  }
}

const cashIn = async (payload: ITransaction, agentData: JwtPayload) => {
  // ১. এজেন্ট এক্সিস্ট করছে কিনা চেক করা
  const agent = await user.findOne({ mobile: agentData.mobile }).select('+pin')
  if (!agent || agent.accountType !== 'Agent') {
    throw new AppError(
      400,
      'Only authorized agents can perform cash-in transactions'
    )
  }
  // ২. এজেন্টের পিন চেক করা
  const isPinMatch = await bcrypt.compare(payload.pin, agent.pin)
  if (!isPinMatch) {
    throw new AppError(401, 'Invalid PIN')
  }

  // ৩. ইউজার এক্সিস্ট করছে কিনা চেক করা
  const receiver = await user.findOne({ mobile: payload.receiverNumber })
  if (!receiver) {
    throw new AppError(404, 'User not found')
  }

  // ৪. ট্রানজেকশন শুরু করা
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // ইউজারের ব্যালেন্স বাড়ানো
    await user.findOneAndUpdate(
      { mobile: payload.receiverNumber },
      { $inc: { balance: payload.amount } },
      { session }
    )

    // মোট সিস্টেম মানি আপডেট করা
    // await system.findOneAndUpdate(
    //   {},
    //   { $inc: { totalMoney: payload.amount } },
    //   { session }
    // )

    // ট্রানজেকশন সফল হলে কমিট করা
    await session.commitTransaction()
    session.endSession()

    return { message: 'Cash-in successful' }
  } catch (error: any) {
    // কোনো সমস্যা হলে ট্রানজেকশন বাতিল করা
    await session.abortTransaction()
    session.endSession()
    throw new AppError(400, error.message)
  }
}

export const tracsactionServices = { sendMoney, cashOut, cashIn }
