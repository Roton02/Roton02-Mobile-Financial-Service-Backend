import { z } from 'zod'

const sendMoneyValidation = z.object({
  receiverNumber: z.string().nonempty(),
  amount: z.number().positive(),
})

export const transactionValidations = { sendMoneyValidation }
