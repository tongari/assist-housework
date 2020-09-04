import { useState, useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { fetchNickName } from 'domain/firestore'

import { myUserDocument, assistantUserIdsCollection } from 'config/firebase'
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
  const [userDoc, isUserDocLoading] = useDocument(myUserDocument())
  const [assistantUserIds, isAssistantUserIdsLoading] = useCollection(
    assistantUserIdsCollection().where('assistantUserId', '==', assistantUserId)
  )

  useEffect(() => {
    if (!isUserDocLoading || !isAssistantUserIdsLoading) {
      setIsLoaded(true)
    }
  }, [isUserDocLoading, isAssistantUserIdsLoading])

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
    const watchId = userDoc?.get('watchId')
    setAssistantUserId(watchId)

    if (roleRef.id !== Roles.Approver) {
      setRenderType('NotFound')
      return
    }

    const assistantUserIdsDoc = assistantUserIds?.docs.find((doc) => {
      return doc.id === watchId
    })

    const state = assistantUserIdsDoc?.get('statusRef')?.id

    // 使うかもしれないので一応、コメントアウト
    // if (assistantUserIds?.metadata.hasPendingWrites) {
    //   return
    // }
    if (state && state !== Status.Register) {
      setRenderType('Setting')
    }
  }, [isLoaded, userDoc, assistantUserIds])

  return {
    isLoaded,
    renderType,
    assistantUserId,
    assistantNickName,
  }
}

export default useInjection
