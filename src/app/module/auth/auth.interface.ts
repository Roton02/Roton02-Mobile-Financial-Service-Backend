export interface IUser {
  name: string
  pin: string // 5 digit PIN
  mobile: string
  email: string
  accountType: 'Agent' | 'User'
  nid: string
  balance?: number
  income?: number
  isBlocked?: boolean
  isDeleted?: boolean
  isActive?: boolean
}

export interface ILogin {
  identifier: string
  pin: string
}
