export enum Paths {
  Login = '/login',
  RegisterApprover = '/register-approver',
  RegisterAssistant = '/register-assistant',
  ApproveAssistant = '/approve-assistant',
  SettingApprover = '/setting-approver',
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
