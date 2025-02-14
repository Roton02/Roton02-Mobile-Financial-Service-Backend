import mongoose, { Schema } from 'mongoose'
import { IRequest, TTransaction } from './transaction.interface'

const transactionSchema = new Schema<TTransaction>(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number },
    transactionType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Transaction = mongoose.model<TTransaction>(
  'Transaction',
  transactionSchema
)

export default Transaction

const RequestSchema = new Schema<IRequest>({
  agent: { type: String, required: true },
  type: {
    type: String,
    enum: ['Cash Request', 'Withdraw Request'],
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
})

export const Request = mongoose.model<IRequest>('Request', RequestSchema)
