import { useState, useEffect, useContext } from 'react'
import { fetchNickname } from 'domain/firestore'

import { Roles, Status } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

export type RenderType = 'NotFound' | 'Register' | 'Setting'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistantNickname: string | null
  assistantUserId?: string | null
} => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const [renderType, setRenderType] = useState<RenderType>('Register')
  const [assistantNickname, setAssistantNickname] = useState<string | null>(
    null
  )

  useEffect(() => {
    let isCleaned = false
    if (isAuthorizeContextLoaded && userInfo?.watchId) {
      fetchNickname(userInfo?.watchId).then((v) => {
        if (!isCleaned) setAssistantNickname(v.data.nickname)
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
    assistantNickname,
  }
}

export default useInjection
