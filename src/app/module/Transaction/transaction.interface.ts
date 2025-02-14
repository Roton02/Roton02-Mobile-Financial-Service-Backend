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

export interface IRequest {
  agent: string
  type: 'Cash Request' | 'Withdraw Request'
  amount: number
  status: 'Pending' | 'Approved' | 'Rejected'
}
