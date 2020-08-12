import React from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import { useOnAuthStateChanged } from 'hooks/useAuthState'

const Auth: React.FC<RouteProps> = ({ children, location }) => {
  const { isAuthStateChanged, isLoggedIn } = useOnAuthStateChanged()

  if (!isAuthStateChanged) {
    return <div>loading...</div>
  }
  if (isLoggedIn) {
    // TODO: 状態によって変更？
    if (location?.pathname === '/') {
      return <Redirect to="/register-approver" />
    }
    return <>{children}</>
  }
  return <Redirect to="/login" />
}

export default Auth
