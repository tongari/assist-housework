import { useState, useEffect, useContext } from 'react'

import { fetchNickname } from 'domain/firestore'
import { Roles, Status } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

export type RenderType = 'NotFound' | 'Pending' | 'Register' | 'Running'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistToApproverId: string | null
  inviteToken: string | null
  approverNickname: string | null
} => {
  // query parameters
  const searchParams = new URLSearchParams(window.location.search)
  const inviteAssistantParams = searchParams.get('invite_assistant') ?? null
  const inviteTokenParams = searchParams.get('token') ?? null

  // context
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistToApproverId, setAssistToApproverId] = useState<string | null>(
    null
  )
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [approverNickname, setApproverNickname] = useState<string | null>(null)

  useEffect(() => {
    let isCleaned = false
    if (isAuthorizeContextLoaded && assistToApproverId) {
      fetchNickname(assistToApproverId).then((v) => {
        if (!isCleaned) setApproverNickname(v.data.nickname)
      })
    }
    return () => {
      isCleaned = true
    }
  }, [isAuthorizeContextLoaded, assistToApproverId])

  useEffect(() => {
    if (!isAuthorizeContextLoaded) return

    if (!userInfo && !inviteAssistantParams && !inviteTokenParams) {
      setRenderType('NotFound')
      return
    }

    if (!userInfo) {
      setAssistToApproverId(inviteAssistantParams)
      setInviteToken(inviteTokenParams)
      return
    }

    setAssistToApproverId(userInfo.watchId)

    if (userInfo.role !== Roles.Assistant) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.state === Status.Running) {
      setRenderType('Running')
      return
    }

    if (
      !(userInfo.state === Status.Register) &&
      !(userInfo.state === Status.Setting)
    ) {
      setRenderType('NotFound')
      return
    }

    setRenderType('Pending')
  }, [
    isAuthorizeContextLoaded,
    userInfo,
    inviteAssistantParams,
    inviteTokenParams,
  ])

  return {
    isLoaded: isAuthorizeContextLoaded,
    renderType,
    assistToApproverId,
    inviteToken,
    approverNickname,
  }
}

export default useInjection
