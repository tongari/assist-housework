import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { Paths, Roles, Status } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

const RootPage: React.FC = () => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  if (!isAuthorizeContextLoaded) {
    return <div>loading...</div>
  }

  const renderApprover = (): React.ReactElement => {
    if (userInfo?.state === Status.Running) {
      return <Redirect to={Paths.WorkApprover} />
    }
    if (userInfo?.state === Status.Setting) {
      return <Redirect to={Paths.SettingApprover} />
    }
    if (userInfo?.state === Status.Register && userInfo.watchId) {
      return <Redirect to={Paths.ApproveAssistant} />
    }
    return <Redirect to={Paths.RegisterApprover} />
  }

  const renderAssistant = (): React.ReactElement => {
    if (userInfo?.state === Status.Running) {
      return <Redirect to={Paths.WorkAssistant} />
    }
    return <Redirect to={Paths.RegisterAssistant} />
  }

  const searchParams = new URLSearchParams(window.location.search)
  const isAssistant = searchParams.has('invite_assistant')

  // ユーザ情報がない状態
  if (!userInfo) {
    return isAssistant ? renderAssistant() : renderApprover()
  }

  if (userInfo?.role === Roles.Approver) {
    return renderApprover()
  }
  if (userInfo?.role === Roles.Assistant) {
    return renderAssistant()
  }
  return null
}

export default RootPage
