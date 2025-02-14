export interface ITransaction {
  receiverNumber: string
  amount: number
  pin: string
}

export type TTransaction = {
  sender: string
  receiver: string
  amount: number
  fee?: number
  transactionType: string
}
