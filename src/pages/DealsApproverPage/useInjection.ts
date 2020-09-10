import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status, GroupDateDeal, Now } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export type RenderType = 'NotFound' | 'Running'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  groupedDateDeals: GroupDateDeal[]
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

  // TODO: ロジック共通化できる
  const calculatedTotalPrice = deals.reduce((prev, next) => {
    if (next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  // TODO: ロジック共通化できる
  const groupDateDeals = () => {
    const result: GroupDateDeal[] = []

    deals.forEach((deal) => {
      const findIndex = result.findIndex(
        (resultItem) => resultItem.date === deal.date
      )

      if (findIndex < 0) {
        result.push({
          date: deal.date,
          day: deal.day,
          deals: [deal],
        })
      } else {
        result[findIndex].deals.push(deal)
      }
    })
    return result
  }

  // TODO: ロジック共通化できる
  const calculatedUnApprovePrice = deals.reduce((prev, next) => {
    if (!next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  // TODO: ロジック共通化できる
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
    groupedDateDeals: groupDateDeals(),
    budget: calcBudget(),
    totalPrice: calculatedTotalPrice,
    unApprovePrice: calculatedUnApprovePrice,
    assistantNickname,
  }
}

export default useInjection
