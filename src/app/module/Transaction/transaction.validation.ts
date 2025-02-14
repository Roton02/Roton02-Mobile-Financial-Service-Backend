import { z } from 'zod'

const sendMoneyValidation = z.object({
  receiverNumber: z
    .string({ invalid_type_error: 'reciver number is Required' })
    .nonempty(),
  amount: z
    .number()
    .positive()
    .min(50, { message: 'Amount should be greater than 49' }),
  pin: z.string({ invalid_type_error: 'PIN number is Required' }).nonempty(),
})
const cashOutInValidation = z.object({
  receiverNumber: z
    .string({ invalid_type_error: 'reciver number is Required' })
    .nonempty(),
  amount: z.number().positive(),
  pin: z.string({ invalid_type_error: 'PIN number is Required' }).nonempty(),
})
export const transactionValidations = {
  sendMoneyValidation,
  cashOutInValidation,
}
