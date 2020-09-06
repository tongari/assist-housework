import { useState, useEffect, useContext } from 'react'
import { Roles } from 'types/index'
import { AuthorizedContext } from 'pages/AuthorizedProvider'

export type RenderType =
  | 'NotFound'
  | 'Pending'
  | 'ApproveAssistant'
  | 'Register'

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  inviteAddress?: string
} => {
  const { isLoaded, userInfo } = useContext(AuthorizedContext)
  const [renderType, setRenderType] = useState<RenderType>('Register')

  useEffect(() => {
    if (!isLoaded || !userInfo) return

    if (userInfo.role !== Roles.Approver) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.watchId) {
      setRenderType('ApproveAssistant')
      return
    }

    if (userInfo.address) {
      setRenderType('Pending')
    }
  }, [isLoaded, userInfo])

  return {
    isLoaded,
    renderType,
    inviteAddress: userInfo?.address,
  }
}

export default useInjection
