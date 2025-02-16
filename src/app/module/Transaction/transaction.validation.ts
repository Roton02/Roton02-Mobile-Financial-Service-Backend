import { z } from 'zod'

const sendMoneyValidation = z.object({
  receiverNumber: z
    .string()
    .nonempty({ message: 'Receiver number is Required' }),
  amount: z
    .number()
    .positive()
    .min(50, { message: 'Amount should be greater than 49' }),
  pin: z.string().nonempty({ message: 'PIN number is Required' }),
})
const cashOutInValidation = z.object({
  receiverNumber: z
    .string()
    .nonempty({ message: 'Receiver number is Required' }),
  amount: z.number().positive(),
  pin: z.string({ invalid_type_error: 'PIN number is Required' }).nonempty(),
})
export const transactionValidations = {
  sendMoneyValidation,
  cashOutInValidation,
}
