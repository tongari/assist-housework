import { useEffect } from 'react'
import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { createApprovalUserDoc, createAssistantUserDoc } from 'domain/firestore'

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: (authResult: {
      additionalUserInfo: { isNewUser: string }
    }) => {
      if (authResult.additionalUserInfo.isNewUser) {
        const searchParams = new URLSearchParams(window.location.search)
        const assistToApproverId = searchParams.get('invite_assistant')

        // TODO: 正式には認証前にバリデーションしたいので後ほどauthUIをやめる
        // 現状、バリデーションが通らない場合は、アカンウト自体は作成されるが、users/{userId}のドキュメントは作成されない。
        if (assistToApproverId) {
          createAssistantUserDoc(assistToApproverId).catch((err) => {
            // eslint-disable-next-line no-alert
            window.alert(err.message)
            // TODO: 認可されない場合、以下の導線を設けるか、検討
            // (1) 承認者としてユーザ登録を促す？
            // (2) アカウントを削除する？
          })
          return false
        }
        createApprovalUserDoc()
      }
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
  firebase.User | undefined,
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
