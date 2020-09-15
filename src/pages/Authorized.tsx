import React, { useContext } from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import { Paths } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import Loader from 'components/molecules/Loader'

const Authorized: React.FC<RouteProps> = ({ children }) => {
  const { authenticated, isAuthLoading, authError } = useContext(
    AuthorizedContext
  )

  if (authError) {
    return <div>happen error...</div>
  }

  if (isAuthLoading) {
    return <Loader isLoading={isAuthLoading} />
  }

  if (authenticated) {
    return <>{children}</>
  }

  return <Redirect to={Paths.Login} />
}

export default Authorized
