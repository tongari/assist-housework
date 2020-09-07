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

import { Now, Item, Budget, Deal } from 'types'
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
}

const useInjection = (): InjectionResult => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  // local state
  const [isContentsContextLoaded, setIsContentsContextLoaded] = useState(false)

  // fetch data
  // TODO: roleによってパス変更
  const [assistantUserDoc, isAssistantUserDocLoading] = useDocument(
    userDocument(userInfo?.watchId)
  )

  // TODO: roleによってパス変更
  const [items, isItemsLoading] = useCollection(
    itemsCollection(userInfo?.watchId, myUserId)
  )
  // TODO: roleによってパス変更
  const [budgets, isBudgetsLoading] = useCollection(
    budgetsCollection(userInfo?.watchId, myUserId)
      .where('year', '==', year)
      .where('month', '==', month)
  )

  // TODO: roleによってパス変更
  const [deals, isDealsLoading] = useCollection(
    dealsCollection(userInfo?.watchId, myUserId)
      .where('year', '==', year)
      .where('month', '==', month)
  )

  useEffect(() => {
    if (
      isAuthorizeContextLoaded &&
      !isAssistantUserDocLoading &&
      !isItemsLoading &&
      !isBudgetsLoading &&
      !isDealsLoading
    ) {
      setIsContentsContextLoaded(true)
    }
  }, [
    isAuthorizeContextLoaded,
    isAssistantUserDocLoading,
    isItemsLoading,
    isBudgetsLoading,
    isDealsLoading,
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
  }
}

export default useInjection
