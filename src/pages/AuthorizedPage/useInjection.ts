import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'

import {
  userDocument,
  assistantUserIdsCollection,
  assistToApproversCollection,
} from 'config/firebase'
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
  const [authenticated, isAuthLoading, authError] = useAuthState(
    firebase.auth()
  )
  const [userDoc, isUserDocLoading] = useDocument(userDocument())
  const [assistantUserIds, isAssistantUserIdsLoading] = useCollection(
    assistantUserIdsCollection()
  )
  const [assistToApprovers, isAssistToApproversLoading] = useCollection(
    assistToApproversCollection()
  )

  const [isLoaded, setIsLoaded] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (
      !isAuthLoading ||
      !isUserDocLoading ||
      !isAssistantUserIdsLoading ||
      !isAssistToApproversLoading
    ) {
      setIsLoaded(true)
    }
  }, [
    isAuthLoading,
    isUserDocLoading,
    isAssistantUserIdsLoading,
    isAssistToApproversLoading,
  ])

  useEffect(() => {
    if (!isLoaded || !userDoc?.exists) return

    const roleRef = userDoc?.get('roleRef')
    const tempWatchId = userDoc?.get('watchId')
    let tempState = null

    if (roleRef.id === Roles.Approver) {
      const assistantUserIdsDoc = assistantUserIds?.docs.find((doc) => {
        return doc.id === tempWatchId
      })
      if (assistantUserIdsDoc?.get('statusRef')) {
        tempState = assistantUserIdsDoc?.get('statusRef').id
      }
    }

    if (roleRef.id === Roles.Assistant) {
      const assistToApproversDoc = assistToApprovers?.docs.find((doc) => {
        return doc.id === tempWatchId
      })
      if (assistToApproversDoc?.get('statusRef')) {
        tempState = assistToApproversDoc?.get('statusRef').id
      }
    }

    setUserData({
      role: roleRef.id,
      state: tempState,
      watchId: tempWatchId,
    })
  }, [isLoaded, userDoc, assistantUserIds, assistToApprovers])

  return {
    isLoaded,
    authenticated,
    userData,
    authError,
  }
}

export default useInjection
