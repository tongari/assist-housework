import React from 'react'
import { Redirect } from 'react-router-dom'
import useLogin from 'hooks/auth/useLogin'
import { Paths } from 'config/paths'

const LoginPage: React.FC = () => {
  const [user, isLoading, error] = useLogin()

  if (isLoading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>happen error...</div>
  }

  if (user) {
    // TODO: 状態によって変更？
    return <Redirect to={Paths.RegisterApprover} />
  }

  return null
}

export default LoginPage
