import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'

import { userDocument } from 'config/firebase'
import { Roles, Status } from 'types/index'

export interface InjectionResult {
  isAuthorizeContextLoaded: boolean
  authenticated: firebase.User | undefined
  isAuthLoading: boolean
  authError: firebase.auth.Error | undefined
  userInfo: UserInfo | null
}

interface UserInfo {
  role: Roles | null
  state: Status | null
  watchId: string | null
  address?: string
}

const useInjection = (): InjectionResult => {
  const [authenticated, isAuthLoading, authError] = useAuthState(
    firebase.auth()
  )
  const [userDoc, isUserDocLoading] = useDocument(userDocument())

  const convertUserInfo = () => {
    if (!userDoc?.get('roleRef')?.id) {
      return null
    }

    return {
      role: userDoc?.get('roleRef')?.id,
      state: userDoc?.get('currentWatchUser')?.statusRef.id,
      watchId: userDoc?.get('currentWatchUser')?.id,
      address: userDoc?.get('currentWatchUser')?.inviteAddress,
    }
  }

  return {
    isAuthorizeContextLoaded: !isAuthLoading && !isUserDocLoading,
    authenticated,
    isAuthLoading,
    authError,
    userInfo: convertUserInfo(),
  }
}

export default useInjection
