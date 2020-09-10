import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status, GroupDateDeal, Now } from 'types'
import { fetchNickName } from 'domain/firestore'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export type RenderType = 'NotFound' | 'Running' | 'Calculation'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  groupedDateDeals: GroupDateDeal[]
  budget: number
  totalPrice: number
  unApprovePrice: number
  approverNickName?: string
}

const useInjection = (): ResultProps => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const { isContentsContextLoaded, now, budgets, deals } = useContext(
    ContentsContext
  )

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Running')
  const [approverNickName, setApproverNickName] = useState<string>('')

  useEffect(() => {
    let isCleaned = false
    if (isAuthorizeContextLoaded && userInfo?.watchId) {
      fetchNickName(userInfo?.watchId).then((v) => {
        if (!isCleaned) setApproverNickName(v.data.nickName)
      })
    }
    return () => {
      isCleaned = true
    }
  }, [isAuthorizeContextLoaded, userInfo])

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !isContentsContextLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    if (
      userInfo.role !== Roles.Assistant ||
      (!(userInfo.state === Status.Running) &&
        !(userInfo.state === Status.Calculation))
    ) {
      setRenderType('NotFound')
      return
    }

    if (userInfo.state === Status.Calculation) {
      setRenderType('Calculation')
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
    approverNickName,
  }
}

export default useInjection
