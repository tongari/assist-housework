import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status, Deal, Now } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export type RenderType = 'NotFound' | 'Running'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  deals: Deal[]
  budget: number
  totalPrice: number
  unApprovePrice: number
  assistantNickname?: string
}

const useInjection = (): ResultProps => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const {
    isContentsContextLoaded,
    now,
    budgets,
    deals,
    assistantNickname,
  } = useContext(ContentsContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Running')

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !isContentsContextLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.role !== Roles.Approver || userInfo.state !== Status.Running) {
      setRenderType('NotFound')
    }
  }, [isAuthorizeContextLoaded, isContentsContextLoaded, userInfo, myUserId])

  const calculatedTotalPrice = deals.reduce((prev, next) => {
    if (next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  const calculatedUnApprovePrice = deals.reduce((prev, next) => {
    if (!next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  const calcBudget = () => {
    if (budgets) {
      const base = budgets[0]?.budget ?? 0
      return base - calculatedTotalPrice
    }
    return 0
  }

  return {
    isLoaded: isAuthorizeContextLoaded && isContentsContextLoaded,
    renderType,
    now,
    deals,
    budget: calcBudget(),
    totalPrice: calculatedTotalPrice,
    unApprovePrice: calculatedUnApprovePrice,
    assistantNickname,
  }
}

export default useInjection
