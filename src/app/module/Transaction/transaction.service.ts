import { user } from '../auth/auth.model'
import { ISendMoney } from './transaction.interface'

const sendMoney = async (payload: ISendMoney) => {
  const isReciverExist = await user.findOne({ mobile: payload.receiverNumber })
  if (!isReciverExist) {
    throw new Error('Receiver not found')
  }
}

export const tracsactionServices = { sendMoney }
