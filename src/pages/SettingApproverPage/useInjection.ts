import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'
import { InjectionResult as ContentsInjectionsResult } from 'contexts/ContentsProvider/useInjection'

export type RenderType = 'NotFound' | 'Setting'

type Props = {
  isLoaded: boolean
  renderType: RenderType
} & Omit<ContentsInjectionsResult, 'isContentsContextLoaded'>

const useInjection = (): Props => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const {
    isContentsContextLoaded,
    assistantNickname,
    now,
    items,
    budgets,
    deals,
  } = useContext(ContentsContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Setting')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isAuthorizeContextLoaded && isContentsContextLoaded) {
      setIsLoaded(true)
    }
  }, [isAuthorizeContextLoaded, isContentsContextLoaded])

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !isContentsContextLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.role !== Roles.Approver || userInfo.state !== Status.Setting) {
      setRenderType('NotFound')
    }
  }, [isAuthorizeContextLoaded, isContentsContextLoaded, userInfo, myUserId])

  return {
    isLoaded,
    renderType,
    assistantNickname,
    now,
    items,
    budgets,
    deals,
  }
}

export default useInjection
