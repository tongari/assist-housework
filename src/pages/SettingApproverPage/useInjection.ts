import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'
import { InjectionResult as ContentsInjectionsResult } from 'contexts/ContentsProvider/useInjection'

export type RenderType = 'NotFound' | 'Setting' | 'Running'

type Props = {
  isLoaded: boolean
  renderType: RenderType
} & Omit<ContentsInjectionsResult, 'isContentsContextLoaded' | 'todayDeals'>

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

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !isContentsContextLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.role !== Roles.Approver) {
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
    }
  }, [isAuthorizeContextLoaded, isContentsContextLoaded, userInfo, myUserId])

  return {
    isLoaded: isAuthorizeContextLoaded && isContentsContextLoaded,
    renderType,
    assistantNickname,
    now,
    items,
    budgets,
    deals,
  }
}

export default useInjection
