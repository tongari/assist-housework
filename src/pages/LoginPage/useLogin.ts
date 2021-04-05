import { useEffect } from 'react'
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { useAuthState } from 'react-firebase-hooks/auth'

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: () => {
      return false
    },
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

const useLogin = (): [
  firebase.User | undefined | null,
  boolean,
  firebase.auth.Error | undefined
] => {
  const [user, isLoading, error] = useAuthState(firebase.auth())

  useEffect(() => {
    const el = document.getElementById(
      'firebaseui-auth-container'
    ) as HTMLDivElement

    if (isLoading || user) {
      el.style.display = 'none'
      return
    }

    el.style.display = 'block'
    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }, [user, isLoading])

  return [user, isLoading, error]
}

export default useLogin
