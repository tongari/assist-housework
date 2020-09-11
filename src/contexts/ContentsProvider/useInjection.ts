import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import {
  userDocument,
  itemsCollection,
  budgetsCollection,
  dealsCollection,
} from 'config/firebase'

import { Now, Item, Budget, Deal, Roles } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import {
  convertedItems,
  convertedBudgets,
  convertedDeals,
} from 'contexts/ContentsProvider/converter'

import { fetchServerTime } from 'domain/firestore'

export interface InjectionResult {
  isContentsContextLoaded: boolean
  assistantNickname?: string
  now: Now
  items: Item[]
  budgets: Budget[]
  deals: Deal[]
  todayDeals: Deal[]
}

const useInjection = (): InjectionResult => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  // local state
  const [isContentsContextLoaded, setIsContentsContextLoaded] = useState(false)
  const [now, setNow] = useState<Now | null>(null)

  // fetch data
  // Only Use Approver
  const [assistantUserDoc, isAssistantUserDocLoading] = useDocument(
    userDocument(userInfo?.watchId)
  )

  const getUserId = () => {
    if (userInfo?.role === Roles.Approver) {
      return userInfo?.watchId
    }
    return firebase.auth().currentUser?.uid
  }

  const getApproverId = () => {
    if (userInfo?.role === Roles.Approver) {
      return firebase.auth().currentUser?.uid
    }
    return userInfo?.watchId
  }

  const [items, isItemsLoading] = useCollection(
    itemsCollection(getUserId(), getApproverId())
  )

  const [budgets, isBudgetsLoading] = useCollection(
    budgetsCollection(getUserId(), getApproverId())
      .where('year', '==', now?.year ?? null)
      .where('month', '==', now?.month ?? null)
  )

  const [deals, isDealsLoading] = useCollection(
    dealsCollection(getUserId(), getApproverId())
      .where('year', '==', now?.year ?? null)
      .where('month', '==', now?.month ?? null)
  )

  const [todayDeals, isTodayDealsLoading] = useCollection(
    dealsCollection(getUserId(), getApproverId())
      .where('year', '==', now?.year ?? null)
      .where('month', '==', now?.month ?? null)
      .where('date', '==', now?.date ?? null)
  )

  useEffect(() => {
    fetchServerTime().then((res) => {
      setNow(res.data)
    })
  }, [])

  useEffect(() => {
    if (
      isAuthorizeContextLoaded &&
      !isAssistantUserDocLoading &&
      !isItemsLoading &&
      !isBudgetsLoading &&
      !isDealsLoading &&
      !isTodayDealsLoading &&
      now
    ) {
      setIsContentsContextLoaded(true)
    }
  }, [
    isAuthorizeContextLoaded,
    isAssistantUserDocLoading,
    isItemsLoading,
    isBudgetsLoading,
    isDealsLoading,
    isTodayDealsLoading,
    now,
  ])

  return {
    isContentsContextLoaded,
    assistantNickname: assistantUserDoc?.get('nickName'),
    now: {
      year: now?.year ?? '',
      month: now?.month ?? '',
      date: now?.date ?? '',
      day: now?.day ?? '',
    },
    items: convertedItems(items),
    budgets: convertedBudgets(budgets),
    deals: convertedDeals(deals),
    todayDeals: convertedDeals(todayDeals),
  }
}

export default useInjection
