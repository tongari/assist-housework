import { useState, useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { fetchNickName } from 'domain/firestore'

import { myUserDocument, assistToApproversCollection } from 'config/firebase'
import { Roles, Status } from 'types/index'

export type RenderType = 'NotFound' | 'Pending' | 'Register'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistToApproverId: string | null
  approverNickName: string | null
} => {
  // query parameters
  const searchParams = new URLSearchParams(window.location.search)
  const inviteAssistantParams = searchParams.get('invite_assistant') ?? null

  // local state
  const [isLoaded, setIsLoaded] = useState(false)
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistToApproverId, setAssistToApproverId] = useState<string | null>(
    null
  )
  const [approverNickName, setApproverNickName] = useState<string | null>(null)

  // fetch data
  const [userDoc, isUserDocLoading] = useDocument(myUserDocument())
  const [assistToApprovers, isAssistToApproversLoading] = useCollection(
    assistToApproversCollection().where(
      'assistToApproverId',
      '==',
      assistToApproverId
    )
  )

  useEffect(() => {
    if (!isUserDocLoading || !isAssistToApproversLoading) {
      setIsLoaded(true)
    }
  }, [isUserDocLoading, isAssistToApproversLoading])

  useEffect(() => {
    if (isLoaded && assistToApproverId) {
      fetchNickName(assistToApproverId).then((v) => {
        setApproverNickName(v.data.nickName)
      })
    }
  }, [isLoaded, assistToApproverId])

  useEffect(() => {
    if (!isLoaded) return

    if (!userDoc?.exists && !inviteAssistantParams) {
      setRenderType('NotFound')
      return
    }

    if (!userDoc?.exists) {
      setAssistToApproverId(inviteAssistantParams)
      return
    }

    const roleRef = userDoc?.get('roleRef')
    const watchId = userDoc?.get('watchId')
    setAssistToApproverId(watchId)

    if (roleRef.id !== Roles.Assistant) {
      setRenderType('NotFound')
      return
    }

    const assistToApproversDoc = assistToApprovers?.docs.find((doc) => {
      return doc.id === watchId
    })

    const state = assistToApproversDoc?.get('statusRef')?.id
    if (assistToApproversDoc && state !== Status.Register) {
      setRenderType('NotFound')
      return
    }

    setRenderType('Pending')
  }, [isLoaded, userDoc, assistToApprovers, inviteAssistantParams])

  return {
    isLoaded,
    renderType,
    assistToApproverId,
    approverNickName,
  }
}

export default useInjection
