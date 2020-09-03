import React from 'react'
import { Redirect } from 'react-router-dom'
import useLogin from 'hooks/auth/useLogin'
import { Paths } from 'types'

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
      return (
        <Redirect
          to={`${Paths.RegisterAssistant}/?${searchParams.toString()}`}
        />
      )
    }
    return <Redirect to={Paths.RegisterApprover} />
  }

  return null
}

export default LoginPage
