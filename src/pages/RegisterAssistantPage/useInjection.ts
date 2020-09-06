import { useState, useEffect, useContext } from 'react'

import { fetchNickName } from 'domain/firestore'
import { Roles, Status } from 'types/index'
import { AuthorizedContext } from 'pages/AuthorizedProvider'

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

  const { isLoaded, userInfo } = useContext(AuthorizedContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistToApproverId, setAssistToApproverId] = useState<string | null>(
    null
  )
  const [approverNickName, setApproverNickName] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && assistToApproverId) {
      fetchNickName(assistToApproverId).then((v) => {
        setApproverNickName(v.data.nickName)
      })
    }
  }, [isLoaded, assistToApproverId])

  useEffect(() => {
    if (!isLoaded) return

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
  }, [isLoaded, userInfo, inviteAssistantParams])

  return {
    isLoaded,
    renderType,
    assistToApproverId,
    approverNickName,
  }
}

export default useInjection
