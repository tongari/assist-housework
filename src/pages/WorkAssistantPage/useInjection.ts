import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { fetchNickName } from 'domain/firestore'
import { Roles, Status, Item, Now } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export type RenderType = 'NotFound' | 'Running' | 'Calculation'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  items: Item[]
  budget: number
  totalPrice: number
  unApprovePrice: number
  approverNickName: string
}

const useInjection = (): ResultProps => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const {
    isContentsContextLoaded,
    now,
    items,
    budgets,
    deals,
    todayDeals,
  } = useContext(ContentsContext)

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

  const compactedItems = items.filter((item) => item.label !== null)

  const addedIsWorkedToItems = compactedItems.map((item) => {
    const existDeal = todayDeals.find((deal) => deal.itemId === item.itemId)
    if (existDeal) {
      return { ...item, isWorked: true }
    }
    return item
  })

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
    items: addedIsWorkedToItems,
    budget: calcBudget(),
    totalPrice: calculatedTotalPrice,
    unApprovePrice: calculatedUnApprovePrice,
    approverNickName,
  }
}

export default useInjection
