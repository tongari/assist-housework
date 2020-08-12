import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { useOnAuthStateChanged } from 'hooks/useAuthState'

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
  const { isAuthStateChanged, isLoggedIn } = useOnAuthStateChanged()

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        const ui = new firebaseui.auth.AuthUI(firebase.auth())
        ui.start('#firebaseui-auth-container', uiConfig)
      }
    })
  }, [])

  if (!isAuthStateChanged) {
    return <div>loading...</div>
  }

  if (isLoggedIn) {
    // TODO: 状態によって変更？
    return <Redirect to="/register-approver" />
  }

  return <div className="firebaseui-auth-container" />
}

export default LoginPage
