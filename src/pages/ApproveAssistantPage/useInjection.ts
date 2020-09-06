import { useState, useEffect, useContext } from 'react'
import { fetchNickName } from 'domain/firestore'

import { Roles, Status } from 'types/index'
import { AuthorizedContext } from 'pages/AuthorizedProvider'

export type RenderType = 'NotFound' | 'Register' | 'Setting'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistantNickName: string | null
  assistantUserId?: string | null
} => {
  const { isLoaded, userInfo } = useContext(AuthorizedContext)

  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistantNickName, setAssistantNickName] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (userInfo?.watchId) {
      fetchNickName(userInfo?.watchId).then((v) => {
        setAssistantNickName(v.data.nickName)
      })
    }
  }, [userInfo])

  useEffect(() => {
    if (!isLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.role !== Roles.Approver || !userInfo.watchId) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.state !== Status.Register) {
      setRenderType('Setting')
    }
  }, [isLoaded, userInfo])

  return {
    isLoaded,
    renderType,
    assistantUserId: userInfo?.watchId,
    assistantNickName,
  }
}

export default useInjection
