import { z } from 'zod'

const registrationValidation = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters'),
  pin: z
    .string()
    .length(5, 'PIN must be exactly 5 digits')
    .regex(/^\d{5}$/, 'PIN must contain only numbers'),
  mobile: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladeshi mobile number') // check bd number
    .max(11, 'Mobile number must be 11 digits')
    .min(11, 'Mobile number must be 11 digits'),
  email: z.string().email('Invalid email address'),
  accountType: z.enum(['Agent', 'User'], {
    errorMap: () => ({ message: 'Account type must be either Agent or User' }),
  }),
  nid: z
    .string()
    .min(10, 'NID must be at least 10 characters long')
    .max(17, 'NID must be at most 17 characters'), // NID minimum 10 and maximum 17
  isBlocked: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
})

const loginValidation = z.object({
  identifier: z.string(),
  pin: z
    .string()
    .length(5, 'PIN must be exactly 5 digits')
    .regex(/^\d{5}$/, 'PIN must contain only numbers'),
})

export const userAuthValidation = {
  registrationValidation,
  loginValidation,
}
