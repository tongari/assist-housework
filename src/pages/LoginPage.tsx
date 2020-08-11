import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
}

const LoginPage: React.FC = () => {
  const [isLoginChecked, setIsLoginCheck] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true)
      } else {
        const ui = new firebaseui.auth.AuthUI(firebase.auth())
        ui.start('#firebaseui-auth-container', uiConfig)
      }
      setIsLoginCheck(true)
    })
  }, [])

  if (!isLoginChecked) {
    return <div>loading...</div>
  }

  if (signedIn) {
    // TODO: 状態によって変更？
    return <Redirect to="/register-approver" />
  }

  return <div className="firebaseui-auth-container" />
}

export default LoginPage
