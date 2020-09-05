import { useState, useEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'
import { fetchNickName } from 'domain/firestore'

import { userDocument } from 'config/firebase'
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
  const [userDoc, isUserDocLoading] = useDocument(userDocument())

  useEffect(() => {
    if (!isUserDocLoading) {
      setIsLoaded(true)
    }
  }, [isUserDocLoading])

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
    const watchId = userDoc?.get('currentWatchUser')?.id
    const state = userDoc?.get('currentWatchUser')?.statusRef?.id
    setAssistToApproverId(watchId)

    if (roleRef.id !== Roles.Assistant) {
      setRenderType('NotFound')
      return
    }

    if (state && state !== Status.Register) {
      setRenderType('NotFound')
      return
    }

    setRenderType('Pending')
  }, [isLoaded, userDoc, inviteAssistantParams])

  return {
    isLoaded,
    renderType,
    assistToApproverId,
    approverNickName,
  }
}

export default useInjection
