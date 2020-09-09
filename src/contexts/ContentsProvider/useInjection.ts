import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

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

const year = format(new Date(), 'yyyy', { locale: ja })
const month = format(new Date(), 'M', { locale: ja })
const date = format(new Date(), 'd', { locale: ja })
const day = format(new Date(), 'E', { locale: ja })

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
      .where('year', '==', year)
      .where('month', '==', month)
  )

  const [deals, isDealsLoading] = useCollection(
    dealsCollection(getUserId(), getApproverId())
      .where('year', '==', year)
      .where('month', '==', month)
  )

  const [todayDeals, isTodayDealsLoading] = useCollection(
    dealsCollection(getUserId(), getApproverId())
      .where('year', '==', year)
      .where('month', '==', month)
      .where('date', '==', date)
  )

  useEffect(() => {
    if (
      isAuthorizeContextLoaded &&
      !isAssistantUserDocLoading &&
      !isItemsLoading &&
      !isBudgetsLoading &&
      !isDealsLoading &&
      !isTodayDealsLoading
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
  ])

  return {
    isContentsContextLoaded,
    assistantNickname: assistantUserDoc?.get('nickName'),
    now: {
      year,
      month,
      date,
      day,
    },
    items: convertedItems(items),
    budgets: convertedBudgets(budgets),
    deals: convertedDeals(deals),
    todayDeals: convertedDeals(todayDeals),
  }
}

export default useInjection
