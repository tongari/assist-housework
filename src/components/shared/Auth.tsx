import React from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'

const Auth: React.FC<RouteProps> = ({ children, location }) => {
  const [user, isLoading, error] = useAuthState(firebase.auth())

  if (isLoading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>happen error...</div>
  }

  if (user) {
    // TODO: 状態によって変更？
    if (location?.pathname === '/') {
      return <Redirect to="/register-approver" />
    }
    return <>{children}</>
  }
  return <Redirect to="/login" />
}

export default Auth
