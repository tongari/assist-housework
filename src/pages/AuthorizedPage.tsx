import React from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'
import { Paths } from 'config/paths'
import { Roles } from 'config/roles'

const Auth: React.FC<RouteProps> = ({ children, location }) => {
  const [user, isLoading, error] = useAuthState(firebase.auth())
  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`)
  )

  if (isLoading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>happen error...</div>
  }

  if (!userDoc) return null

  if (user) {
    if (location?.pathname === '/') {
      const searchParams = new URLSearchParams(window.location.search)
      const isAssistant = searchParams.has('invite_assistant')

      const roleRef = userDoc?.get('roleRef')
      const watchId = userDoc?.get('watchId')

      if (roleRef) {
        if (roleRef?.id === Roles.Approver && watchId) {
          return <Redirect to={Paths.ApproveAssistant} />
        }

        if (roleRef?.id === Roles.Approver) {
          return <Redirect to={Paths.RegisterApprover} />
        }
        if (roleRef?.id === Roles.Assistant) {
          return <Redirect to={Paths.RegisterAssistant} />
        }
      }

      if (isAssistant) {
        return <Redirect to={Paths.RegisterAssistant} />
      }

      return <Redirect to={Paths.RegisterApprover} />
    }
    return <>{children}</>
  }
  return <Redirect to={Paths.Login} />
}

export default Auth
