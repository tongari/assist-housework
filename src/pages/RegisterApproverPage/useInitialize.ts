import { useState, useEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'

import { myUserDocument } from 'config/firebase'
import { Roles } from 'types/index'

interface User {
  role: Roles | null
  watchId: string | null
  inviteAddress: string | null
}

const useInitialize = (): {
  isLoaded: boolean
  userData: User | null
} => {
  const [userDoc, isUserDocLoading] = useDocument(myUserDocument())

  const [isLoaded, setIsLoaded] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (!isUserDocLoading) {
      setIsLoaded(true)
    }
  }, [isUserDocLoading])

  useEffect(() => {
    if (!isLoaded || !userDoc?.exists) return

    const roleRef = userDoc?.get('roleRef')
    const inviteAddress = userDoc?.get('inviteAddress')
    const watchId = userDoc?.get('watchId')

    setUserData({
      role: roleRef.id,
      watchId,
      inviteAddress,
    })
  }, [isLoaded, userDoc])

  return {
    isLoaded,
    userData,
  }
}

export default useInitialize
