import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'

import { userDocument } from 'config/firebase'
import { Roles, Status, Now } from 'types/index'

import { fetchServerTime } from 'domain/firestore'

export interface InjectionResult {
  isAuthorizeContextLoaded: boolean
  authenticated: firebase.User | undefined
  isAuthLoading: boolean
  authError: firebase.auth.Error | undefined
  userInfo: UserInfo | null
  now: Now
}

interface UserInfo {
  role: Roles | null
  nickname: string
  state: Status | null
  watchId: string | null
  year?: string
  month?: string
}

const useInjection = (): InjectionResult => {
  const [authenticated, isAuthLoading, authError] = useAuthState(
    firebase.auth()
  )
  const [userDoc, isUserDocLoading] = useDocument(userDocument())
  const [now, setNow] = useState<Now | null>(null)

  useEffect(() => {
    let isCleaned = false
    if (!isAuthLoading) {
      fetchServerTime().then((res) => {
        if (!isCleaned) setNow(res.data)
      })
    }
    return () => {
      isCleaned = true
    }
  }, [isAuthLoading])

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
      !isAuthLoading && !isUserDocLoading && now !== null,
    authenticated,
    isAuthLoading,
    authError,
    userInfo: convertUserInfo(),
    now: {
      year: now?.year ?? '',
      month: now?.month ?? '',
      date: now?.date ?? '',
      day: now?.day ?? '',
    },
  }
}

export default useInjection
