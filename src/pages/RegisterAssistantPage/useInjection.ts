import { useState, useEffect, useContext } from 'react'

import { fetchNickName } from 'domain/firestore'
import { Roles, Status } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

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

  // context
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistToApproverId, setAssistToApproverId] = useState<string | null>(
    null
  )
  const [approverNickName, setApproverNickName] = useState<string | null>(null)

  useEffect(() => {
    let isCleaned = false
    if (isAuthorizeContextLoaded && assistToApproverId) {
      fetchNickName(assistToApproverId).then((v) => {
        if (!isCleaned) setApproverNickName(v.data.nickName)
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

    if (userInfo.state !== Status.Register) {
      setRenderType('NotFound')
      return
    }

    setRenderType('Pending')
  }, [isAuthorizeContextLoaded, userInfo, inviteAssistantParams])

  return {
    isLoaded: isAuthorizeContextLoaded,
    renderType,
    assistToApproverId,
    approverNickName,
  }
}

export default useInjection
