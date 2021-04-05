import firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'

import { userDocument, serverTimeDocument } from 'config/firebase'
import { Roles, Status, Now } from 'types/index'

interface UserInfo {
  role: Roles | null
  nickname: string
  state: Status | null
  watchId: string | null
  year?: string
  month?: string
}
export interface InjectionResult {
  isAuthorizeContextLoaded: boolean
  authenticated: firebase.User | undefined | null
  isAuthLoading: boolean
  authError: firebase.auth.Error | undefined
  userInfo: UserInfo | null
  now: Now
}

const useInjection = (): InjectionResult => {
  const [authenticated, isAuthLoading, authError] = useAuthState(
    firebase.auth()
  )
  const [userDoc, isUserDocLoading] = useDocument(userDocument())
  const [serverTimeDoc, isServerTimeDocLoading] = useDocument(
    serverTimeDocument()
  )

  const convertUserInfo = () => {
    if (!userDoc?.get('roleRef')?.id) {
      return null
    }

    return {
      role: userDoc?.get('roleRef')?.id,
      nickname: userDoc?.get('nickname'),
      state: userDoc?.get('currentWatchUser')?.statusRef.id,
      watchId: userDoc?.get('currentWatchUser')?.id,
      year: userDoc?.get('currentWatchUser')?.year,
      month: userDoc?.get('currentWatchUser')?.month,
    }
  }

  return {
    isAuthorizeContextLoaded:
      !isAuthLoading && !isUserDocLoading && !isServerTimeDocLoading,
    authenticated,
    isAuthLoading,
    authError,
    userInfo: convertUserInfo(),
    now: {
      year: serverTimeDoc?.get('year') ?? '',
      month: serverTimeDoc?.get('month') ?? '',
      date: serverTimeDoc?.get('date') ?? '',
      day: serverTimeDoc?.get('day') ?? '',
    },
  }
}

export default useInjection
