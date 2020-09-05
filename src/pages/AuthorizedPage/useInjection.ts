import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'

import { userDocument } from 'config/firebase'
import { Roles, Status } from 'types/index'

interface User {
  role: Roles | null
  state: Status | null
  watchId: string | null
}

const useInjection = (): {
  isLoaded: boolean
  authenticated: firebase.User | undefined
  userData: User | null
  authError: firebase.auth.Error | undefined
} => {
  // local state
  const [isLoaded, setIsLoaded] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)

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

    setUserData({
      role: roleRef.id,
      state,
      watchId,
    })
  }, [isLoaded, userDoc])

  return {
    isLoaded,
    authenticated,
    userData,
    authError,
  }
}

export default useInjection
