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
  { timestamps: true, versionKey: false }
)

const Transaction = mongoose.model<TTransaction>(
  'Transaction',
  transactionSchema
)

export default Transaction

const RequestSchema = new Schema<IRequest>(
  {
    agent: { type: String },
    type: {
      type: String,
    },
    amount: { type: Number, default: 100000, max: 100000 },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true, versionKey: false }
)

export const Request = mongoose.model<IRequest>('Request', RequestSchema)
