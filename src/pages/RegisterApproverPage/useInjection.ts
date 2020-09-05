import { useState, useEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'

import { userDocument } from 'config/firebase'
import { Roles } from 'types/index'

export type RenderType =
  | 'NotFound'
  | 'Pending'
  | 'ApproveAssistant'
  | 'Register'

const useInjection = (): {
  isLoaded: boolean
  inviteAddress: string
  renderType: RenderType
} => {
  const [userDoc, isUserDocLoading] = useDocument(userDocument())

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
    const address = userDoc?.get('currentWatchUser')?.inviteAddress
    const watchId = userDoc?.get('currentWatchUser')?.id

    if (roleRef.id !== Roles.Approver) {
      setRenderType('NotFound')
      return
    }

    if (watchId) {
      setRenderType('ApproveAssistant')
      return
    }

    if (address) {
      setRenderType('Pending')
      setInviteAddress(address)
    }
  }, [isLoaded, userDoc])

  return {
    isLoaded,
    renderType,
    inviteAddress,
  }
}

export default useInjection
