import { z } from 'zod'

const sendMoneyValidation = z.object({
  receiverNumber: z.string().nonempty(),
  amount: z
    .number()
    .positive()
    .min(50, { message: 'Amount should be greater than 49' }),
})
const cashOutValidation = z.object({
  receiverNumber: z.string().nonempty(),
  amount: z.number().positive(),
})
export const transactionValidations = { sendMoneyValidation, cashOutValidation }
