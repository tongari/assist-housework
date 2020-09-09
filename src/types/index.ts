export enum Paths {
  Root = '/',
  Login = '/login',
  RegisterApprover = '/register-approver',
  RegisterAssistant = '/register-assistant',
  ApproveAssistant = '/approve-assistant',
  SettingApprover = '/setting-approver',
  WorkAssistant = '/work-assistant',
  WorkApprover = '/work-approver',
  NotFound = '/404.html',
}

export enum Roles {
  Admin = '1',
  Approver = '2',
  Assistant = '3',
}

export enum Status {
  Register = '1',
  Setting = '2',
  Running = '3',
  Calculation = '4',
}

export interface Now {
  year: string
  month: string
  date: string
  day: string
}

export interface Item {
  itemId: string
  label: string | null
  price: number | null
  isWorked?: boolean
}

export interface Budget {
  year: string
  month: string
  budget: number | null
}

export interface Deal {
  year: string
  month: string
  date: string
  day: string
  itemId: string
  itemLabel: string
  price: number
  isApproved: boolean
}
