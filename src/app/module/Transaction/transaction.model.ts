import mongoose, { Schema } from 'mongoose'
import { TTransaction } from './transaction.interface'

const transactionSchema = new Schema<TTransaction>(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    transactionType: {
      type: String,
      required: true,
      enum: ['Cash In', 'Cash Out'],
    },
  },
  { timestamps: true }
)

const Transaction = mongoose.model<TTransaction>(
  'Transaction',
  transactionSchema
)

export default Transaction
