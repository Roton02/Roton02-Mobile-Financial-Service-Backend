/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import AppError from '../../error/AppError'
import { user } from '../auth/auth.model'
import { JwtPayload } from 'jsonwebtoken'
import { ITransaction } from './transaction.interface'
import { ADMIN_MOBILE } from './transaction.const'
import bcrypt from 'bcryptjs'
import Transaction, { Request } from './transaction.model'

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
        { $inc: { income: sendFee } },
        { session }
      )
    }

    const transaction = new Transaction({
      sender: sender.mobile,
      receiver: receiver.mobile,
      amount: payload.amount,
      fee: sendFee,
      transactionType: 'SendMoney',
      timestamp: new Date(),
    })

    await transaction.save({ session })

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
  if (!agent.isActive) {
    throw new AppError(400, 'agent account is Deactivated')
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
    const transaction = new Transaction({
      sender: sender.mobile,
      receiver: agent.mobile,
      amount: payload.amount,
      fee: cashOutFee,
      transactionType: 'Cash Out',
      timestamp: new Date(),
    })

    await transaction.save({ session })

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

    //
    await user.findOneAndUpdate(
      { mobile: agent.mobile },
      { $inc: { balance: -payload.amount } },
      { session }
    )

    // ট্রানজেকশন সফল হলে কমিট করা

    const transaction = new Transaction({
      sender: agent.mobile,
      receiver: receiver.mobile,
      amount: payload.amount,
      transactionType: 'CashIn',
    })

    await transaction.save({ session })

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

const getsingleUserTransactionIntoDB = async (mobile: string) => {
  const transactions = await Transaction.find({
    $or: [{ sender: mobile }, { receiver: mobile }],
  })
  return transactions
}
const getTransactionsIntoDB = async (userData: JwtPayload) => {
  if (userData.accountType === 'User') {
    const transactions = await Transaction.find({
      $or: [{ sender: userData.mobile }, { receiver: userData.mobile }],
    }).limit(100)
    return transactions
  } else if (userData.accountType === 'Agent') {
    const transactions = await Transaction.find({
      $or: [{ sender: userData.mobile }, { receiver: userData.mobile }],
    }).limit(100)
    return transactions
  } else if (userData.accountType === 'Admin') {
    const transactions = await Transaction.find()
    return transactions
  }
  return []
}

const cashRequestIntoDB = async (
  userData: JwtPayload,
  body: { amount: number; pin: string }
) => {
  const verfifyPassword = await bcrypt.compare(body.pin, userData.pin)
  if (!verfifyPassword) {
    throw new AppError(401, 'Invalid PIN')
  }
  const newRequest = new Request({
    agent: userData.mobile,
    type: 'CashRequest',
    amount: body.amount,
    status: 'Pending',
  })

  await newRequest.save()
  return { message: 'Cash request submitted successfully!' }
}
const withdrawRequestIntoDB = async (
  userData: JwtPayload,
  body: { amount: number; pin: string }
) => {
  const verfifyPassword = await bcrypt.compare(body.pin, userData.pin)
  if (!verfifyPassword) {
    throw new AppError(401, 'Invalid PIN')
  }
  const newRequest = new Request({
    agent: userData.mobile,
    type: 'WithdrawRequest',
    amount: body.amount,
    status: 'Pending',
  })

  await newRequest.save()
  return { message: 'Withdraw request submitted successfully!' }
}

const approveWithDrawRequestIntoDB = async (id: string, status: boolean) => {
  const withDrawOwner = await Request.findById(id)
  if (!withDrawOwner) {
    throw new AppError(404, 'User not found')
  }
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    //if status is true then approve the request and descement main balance and change the status in the request database collection
    if (status) {
      await Request.findByIdAndUpdate(
        id,
        { status: 'Approved' },
        { session, new: true }
      )
      await user.findByIdAndUpdate(
        { id },
        { $inc: { balance: -withDrawOwner.amount } },
        { session }
      )
      return { message: 'withdraw Request approved successfully!' }
    }
    //if status is false then reject the request and change the status in the request database collection
    if (!status) {
      await Request.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true })
      return { message: ' with draw Request rejected successfully!' }
    }
    await session.commitTransaction()
    session.endSession()
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(400, error.message)
  }
}
const approveCashRequestIntoDB = async (id: string, status: string) => {
  const RequesteOwner = await Request.findById(id)
  if (!RequesteOwner) {
    throw new AppError(404, 'Request not found')
  }
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    //if status is true then approve the request and descement main balance and change the status in the request database collection
    if (status) {
      await Request.findByIdAndUpdate(
        id,
        { status: 'Approved' },
        { session, new: true }
      )
      await user.findByIdAndUpdate(
        { id },
        { $inc: { balance: RequesteOwner.amount } },
        { session }
      )
      return { message: 'cash Request approved successfully!' }
    }
    //if status is false then reject the request and change the status in the request database collection
    if (!status) {
      await Request.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true })
      return { message: 'cash Request rejected successfully!' }
    }
    await session.commitTransaction()
    session.endSession()
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(400, error.message)
  }
}
const getAllWithdrawRequestIntoDB = async () => {
  const requests = await Request.find({ type: 'Withdraw Request' })
  return requests
}
const getAllCashRequestIntoDB = async () => {
  const requests = await Request.find({ type: 'Cash Request' })
  return requests
}
export const tracsactionServices = {
  sendMoney,
  cashOut,
  cashIn,
  getTransactionsIntoDB,
  getsingleUserTransactionIntoDB,
  cashRequestIntoDB,
  withdrawRequestIntoDB,
  approveWithDrawRequestIntoDB,
  approveCashRequestIntoDB,
  getAllWithdrawRequestIntoDB,
  getAllCashRequestIntoDB,
}
