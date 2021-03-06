export enum Paths {
  Root = '/',
  Login = '/login',
  RegisterApprover = '/register-approver',
  RegisterAssistant = '/register-assistant',
  ApproveAssistant = '/approve-assistant',
  SettingApprover = '/setting-approver',
  WorkAssistant = '/work-assistant',
  WorkApprover = '/work-approver',
  DealsApprover = '/deals-approver',
  DealsAssistant = '/deals-assistant',
  CalculationAssistant = '/calculation-assistant',
  CalculationApprover = '/calculation-approver',
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
  itemId: string | null
  label: string | null
  price: number | null
  isWorked?: boolean
}

export interface Budget {
  budgetId: string
  year: string
  month: string
  budget: number | null
}

export interface Deal {
  id: string
  year: string
  month: string
  date: string
  day: string
  itemId: string
  itemLabel: string
  price: number
  isApproved: boolean
}

export interface GroupDateDeal {
  month: string
  date: string
  day: string
  deals: Deal[]
}
