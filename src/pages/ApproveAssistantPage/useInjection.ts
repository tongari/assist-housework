import { useState, useEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'
import { fetchNickName } from 'domain/firestore'

import { userDocument } from 'config/firebase'
import { Roles, Status } from 'types/index'

export type RenderType = 'NotFound' | 'Register' | 'Setting'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistantUserId: string | null
  assistantNickName: string | null
} => {
  // local state
  const [isLoaded, setIsLoaded] = useState(false)
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistantUserId, setAssistantUserId] = useState<string | null>(null)
  const [assistantNickName, setAssistantNickName] = useState<string | null>(
    null
  )

  // fetch data
  const [userDoc, isUserDocLoading] = useDocument(userDocument())

  useEffect(() => {
    if (!isUserDocLoading) {
      setIsLoaded(true)
    }
  }, [isUserDocLoading])

  useEffect(() => {
    if (isLoaded && assistantUserId) {
      fetchNickName(assistantUserId).then((v) => {
        setAssistantNickName(v.data.nickName)
      })
    }
  }, [isLoaded, assistantUserId])

  useEffect(() => {
    if (!isLoaded) return

    if (!userDoc?.exists) {
      setRenderType('NotFound')
      return
    }

    const roleRef = userDoc?.get('roleRef')
    const watchId = userDoc?.get('currentWatchUser')?.id
    const statusRef = userDoc?.get('currentWatchUser')?.statusRef
    setAssistantUserId(watchId)

    if (roleRef.id !== Roles.Approver || !watchId) {
      setRenderType('NotFound')
      return
    }

    const state = statusRef?.id
    if (state && state !== Status.Register) {
      setRenderType('Setting')
    }
  }, [isLoaded, userDoc])

  return {
    isLoaded,
    renderType,
    assistantUserId,
    assistantNickName,
  }
}

export default useInjection
