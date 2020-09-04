import { useState, useEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'

import { myUserDocument } from 'config/firebase'
import { Roles } from 'types/index'

export type RenderType =
  | 'NotFound'
  | 'Pending'
  | 'ApproveAssistant'
  | 'Register'

interface User {
  role: Roles | null
  watchId: string | null
  inviteAddress: string | null
}

const useInitialize = (): {
  isLoaded: boolean
  inviteAddress: string
  renderType: RenderType
} => {
  const [userDoc, isUserDocLoading] = useDocument(myUserDocument())

  const [isLoaded, setIsLoaded] = useState(false)
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [inviteAddress, setInviteAddress] = useState<string>('')

  useEffect(() => {
    if (!isUserDocLoading) {
      setIsLoaded(true)
    }
  }, [isUserDocLoading])

  useEffect(() => {
    if (!isLoaded || !userDoc?.exists) return

    const roleRef = userDoc?.get('roleRef')
    const address = userDoc?.get('inviteAddress')
    const watchId = userDoc?.get('watchId')

    if (roleRef.id !== Roles.Approver) {
      setRenderType('NotFound')
      return
    }

    if (address) {
      setRenderType('Pending')
      setInviteAddress(address)
      return
    }

    if (watchId) {
      setRenderType('ApproveAssistant')
    }
  }, [isLoaded, userDoc])

  return {
    isLoaded,
    renderType,
    inviteAddress,
  }
}

export default useInitialize
