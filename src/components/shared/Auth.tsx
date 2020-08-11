import React, { useState, useEffect } from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/auth'

const Auth: React.FC<RouteProps> = ({ children, location }) => {
  const [isLoginChecked, setIsLoginCheck] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true)
      }
      setIsLoginCheck(true)
    })
  }, [])

  if (!isLoginChecked) {
    return <div>loading...</div>
  }

  if (signedIn) {
    // TODO: 状態によって変更？
    if (location?.pathname === '/') {
      return <Redirect to="/register-approver" />
    }
    return <>{children}</>
  }

  return <Redirect to="/login" />
}

export default Auth
