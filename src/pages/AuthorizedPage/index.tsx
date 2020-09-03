import React from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import { Paths, Roles, Status } from 'types'
import useInitialize from './useInitialize'

const Auth: React.FC<RouteProps> = ({ children, location }) => {
  const { isLoaded, authenticated, userData, authError } = useInitialize()

  if (authError) {
    return <div>happen error...</div>
  }

  if (!isLoaded) {
    return <div>loading...</div>
  }

  const renderApprover = (): React.ReactElement => {
    // if (userData?.state === Status.Setting) { }
    if (userData?.state === Status.Register && userData.watchId) {
      return <Redirect to={Paths.ApproveAssistant} />
    }
    return <Redirect to={Paths.RegisterApprover} />
  }

  const renderAssistant = (): React.ReactElement => {
    // if (userData?.state === Status.Setting) { }
    return <Redirect to={Paths.RegisterAssistant} />
  }

  if (authenticated) {
    if (location?.pathname === '/') {
      const searchParams = new URLSearchParams(window.location.search)
      const isAssistant = searchParams.has('invite_assistant')

      // ユーザ情報がない状態
      if (!userData) {
        return isAssistant ? renderAssistant() : renderApprover()
      }

      if (userData?.role === Roles.Approver) {
        return renderApprover()
      }
      if (userData?.role === Roles.Assistant) {
        return renderAssistant()
      }
    }
    return <>{children}</>
  }

  return <Redirect to={Paths.Login} />
}

export default Auth
