import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'components/molecules/Loader'
import useLogin from 'pages/LoginPage/useLogin'
import { Paths } from 'types'

const LoginPage: React.FC = () => {
  const [user, isLoading, error] = useLogin()
  if (isLoading) {
    return <Loader isLoading={isLoading} />
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
    return <Redirect to={Paths.Root} />
  }

  return null
}

export default LoginPage
