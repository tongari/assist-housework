import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'
import { InjectionResult as ContentsInjectionsResult } from 'contexts/ContentsProvider/useInjection'

export type RenderType = 'NotFound' | 'Running'

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
  const [renderType, setRenderType] = useState<RenderType>('Running')

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !isContentsContextLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    if (
      userInfo.role !== Roles.Assistant ||
      userInfo.state !== Status.Running
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
