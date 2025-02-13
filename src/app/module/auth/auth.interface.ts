export interface IUser {
  name: string
  pin: string // 5 digit PIN
  mobile: string
  email: string
  accountType: 'Agent' | 'User'
  nid: string
  balance?: number
  isBlocked?: boolean
  isDeleted?: boolean
}

export interface ILogin {
  identifier: string
  pin: string
}
