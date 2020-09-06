import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'

import { userDocument } from 'config/firebase'
import { Roles, Status } from 'types/index'

export interface UserInfo {
  role: Roles | null
  state: Status | null
  watchId: string | null
  address?: string
}

const useAuthorizedProviderInjection = (): {
  isLoaded: boolean
  authenticated: firebase.User | undefined
  isAuthLoading: boolean
  authError: firebase.auth.Error | undefined
  userInfo: UserInfo | null
} => {
  // local state
  const [isLoaded, setIsLoaded] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  // fetch data
  const [authenticated, isAuthLoading, authError] = useAuthState(
    firebase.auth()
  )
  const [userDoc, isUserDocLoading] = useDocument(userDocument())

  useEffect(() => {
    if (!isAuthLoading || !isUserDocLoading) {
      setIsLoaded(true)
    }
  }, [isAuthLoading, isUserDocLoading])

  useEffect(() => {
    if (!isLoaded || !userDoc?.exists) return

    const roleRef = userDoc?.get('roleRef')
    const state = userDoc?.get('currentWatchUser')?.statusRef.id
    const watchId = userDoc?.get('currentWatchUser')?.id
    const address = userDoc?.get('currentWatchUser')?.inviteAddress

    setUserInfo({
      role: roleRef.id,
      state,
      watchId,
      address,
    })
  }, [isLoaded, userDoc])

  return {
    isLoaded,
    authenticated,
    isAuthLoading,
    authError,
    userInfo,
  }
}

export default useAuthorizedProviderInjection
