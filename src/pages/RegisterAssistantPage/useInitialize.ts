import { useState, useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { fetchNickName } from 'domain/firestore'

import {
  myUserDocument,
  assistantUserIdsCollection,
  assistToApproversCollection,
} from 'config/firebase'
import { Roles, Status } from 'types/index'

export type RenderType = 'NotFound' | 'Pending' | 'Register'

const useInitialize = (): {
  isLoaded: boolean
  renderType: RenderType
  assistToApproverId: string | null
  approverNickName: string | null
} => {
  // query parameters
  const searchParams = new URLSearchParams(window.location.search)
  const inviteAssistantParams = searchParams.get('invite_assistant') ?? null

  // fetch data
  const [userDoc, isUserDocLoading] = useDocument(myUserDocument())
  const [assistantUserIds, isAssistantUserIdsLoading] = useCollection(
    assistantUserIdsCollection()
  )
  const [assistToApprovers, isAssistToApproversLoading] = useCollection(
    assistToApproversCollection()
  )

  // local state
  const [isLoaded, setIsLoaded] = useState(false)
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistToApproverId, setAssistToApproverId] = useState<string | null>(
    null
  )
  const [approverNickName, setApproverNickName] = useState<string | null>(null)

  useEffect(() => {
    if (
      !isUserDocLoading ||
      !isAssistantUserIdsLoading ||
      !isAssistToApproversLoading
    ) {
      setIsLoaded(true)
    }
  }, [isUserDocLoading, isAssistantUserIdsLoading, isAssistToApproversLoading])

  useEffect(() => {
    if (isLoaded && assistToApproverId) {
      fetchNickName(assistToApproverId).then((v) => {
        setApproverNickName(v.data.nickName)
      })
    }
  }, [isLoaded, assistToApproverId])

  useEffect(() => {
    if (!isLoaded) return

    if (!inviteAssistantParams) {
      setRenderType('NotFound')
      return
    }

    if (!userDoc?.exists) {
      setAssistToApproverId(inviteAssistantParams)
      return
    }

    const roleRef = userDoc?.get('roleRef')
    const watchId = userDoc?.get('watchId')
    let tempState = null

    if (roleRef.id === Roles.Approver) {
      const assistantUserIdsDoc = assistantUserIds?.docs.find((doc) => {
        return doc.id === watchId
      })
      if (assistantUserIdsDoc?.get('statusRef')) {
        tempState = assistantUserIdsDoc?.get('statusRef').id
      }
    }

    if (roleRef.id === Roles.Assistant) {
      const assistToApproversDoc = assistToApprovers?.docs.find((doc) => {
        return doc.id === watchId
      })
      if (assistToApproversDoc?.get('statusRef')) {
        tempState = assistToApproversDoc?.get('statusRef').id
      }
    }

    if (
      roleRef.id !== Roles.Assistant ||
      tempState !== Status.Register ||
      !watchId
    ) {
      setRenderType('NotFound')
      return
    }

    setAssistToApproverId(watchId)
    setRenderType('Pending')
  }, [
    isLoaded,
    userDoc,
    assistantUserIds,
    assistToApprovers,
    inviteAssistantParams,
  ])

  return {
    isLoaded,
    renderType,
    assistToApproverId,
    approverNickName,
  }
}

export default useInitialize
