import { useState, useEffect, useContext } from 'react'
import { fetchNickName } from 'domain/firestore'

import { Roles, Status } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

export type RenderType = 'NotFound' | 'Register' | 'Setting'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistantNickName: string | null
  assistantUserId?: string | null
} => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistantNickName, setAssistantNickName] = useState<string | null>(
    null
  )

  useEffect(() => {
    let isCleaned = false
    if (isAuthorizeContextLoaded && userInfo?.watchId) {
      fetchNickName(userInfo?.watchId).then((v) => {
        if (!isCleaned) setAssistantNickName(v.data.nickName)
      })
    }
    return () => {
      isCleaned = true
    }
  }, [isAuthorizeContextLoaded, userInfo])

  useEffect(() => {
    if (!isAuthorizeContextLoaded) return

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
  }, [isAuthorizeContextLoaded, userInfo])

  return {
    isLoaded: isAuthorizeContextLoaded,
    renderType,
    assistantUserId: userInfo?.watchId,
    assistantNickName,
  }
}

export default useInjection
