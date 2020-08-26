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
    const searchParams = new URLSearchParams(window.location.search)
    const isAssistant = searchParams.has('invite_assistant')
    if (isAssistant) {
      const addParams = searchParams.get('invite_assistant')
      return (
        <Redirect
          to={`${Paths.RegisterAssistant}/?invite_assistant=${addParams}`}
        />
      )
    }
    return <Redirect to={Paths.RegisterApprover} />
  }

  return null
}

export default LoginPage
