import { useState, useEffect, useContext } from 'react'

import { fetchNickname } from 'domain/firestore'
import { Roles, Status } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

export type RenderType = 'NotFound' | 'Pending' | 'Register' | 'Running'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistToApproverId: string | null
  approverNickname: string | null
} => {
  // query parameters
  const searchParams = new URLSearchParams(window.location.search)
  const inviteAssistantParams = searchParams.get('invite_assistant') ?? null

  // context
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistToApproverId, setAssistToApproverId] = useState<string | null>(
    null
  )
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

    if (!userInfo && !inviteAssistantParams) {
      setRenderType('NotFound')
      return
    }

    if (!userInfo) {
      setAssistToApproverId(inviteAssistantParams)
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
  }, [isAuthorizeContextLoaded, userInfo, inviteAssistantParams])

  return {
    isLoaded: isAuthorizeContextLoaded,
    renderType,
    assistToApproverId,
    approverNickname,
  }
}

export default useInjection
