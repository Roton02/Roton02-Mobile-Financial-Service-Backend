import { user } from '../auth/auth.model'

export const cheeckReciver = async (receiverNumber: string) => {
  const isReciverExist = await user.findOne({
    mobile: receiverNumber,
  })
  if (!isReciverExist) {
    throw new Error('Receiver not found')
  }
  return isReciverExist
}
