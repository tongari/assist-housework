import { useState, useEffect, useContext } from 'react'
import { Roles } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

export type RenderType =
  | 'NotFound'
  | 'Pending'
  | 'ApproveAssistant'
  | 'Register'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  myNickname: string
} => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)
  const [renderType, setRenderType] = useState<RenderType>('Register')

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !userInfo) return

    if (userInfo.role !== Roles.Approver) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.watchId) {
      setRenderType('ApproveAssistant')
      return
    }

    if (userInfo) {
      setRenderType('Pending')
    }
  }, [isAuthorizeContextLoaded, userInfo])

  return {
    isLoaded: isAuthorizeContextLoaded,
    renderType,
    myNickname: userInfo?.nickname ?? '',
  }
}

export default useInjection
