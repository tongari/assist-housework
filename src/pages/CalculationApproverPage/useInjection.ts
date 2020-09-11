import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status, Now } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export type RenderType = 'NotFound' | 'Calculation' | 'Running'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  totalPrice: number
  unApprovePrice: number
  assistantNickname?: string
}

const useInjection = (): ResultProps => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const { isContentsContextLoaded, now, deals, assistantNickname } = useContext(
    ContentsContext
  )

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Calculation')

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !isContentsContextLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    if (
      userInfo.role !== Roles.Approver ||
      (!(userInfo.state === Status.Running) &&
        !(userInfo.state === Status.Calculation))
    ) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.state === Status.Running) {
      setRenderType('Running')
    }
  }, [isAuthorizeContextLoaded, isContentsContextLoaded, userInfo, myUserId])

  // TODO: ロジック共通化できる
  const calculatedTotalPrice = deals.reduce((prev, next) => {
    if (next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  // TODO: ロジック共通化できる
  const calculatedUnApprovePrice = deals.reduce((prev, next) => {
    if (!next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  return {
    isLoaded: isAuthorizeContextLoaded && isContentsContextLoaded,
    renderType,
    now,
    totalPrice: calculatedTotalPrice,
    unApprovePrice: calculatedUnApprovePrice,
    assistantNickname,
  }
}

export default useInjection
