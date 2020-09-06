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

import { AuthorizedContext } from 'contexts/AuthorizedProvider'

const year = format(new Date(), 'yyyy', { locale: ja })
const month = format(new Date(), 'M', { locale: ja })
const date = format(new Date(), 'd', { locale: ja })
const day = format(new Date(), 'E', { locale: ja })

export interface InjectionResult {
  isContentsContextLoaded: boolean
  assistantNickname?: string
  now: {
    year: string
    month: string
    date: string
    day: string
  }
  items:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | undefined
  budgets:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | undefined
  deals:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | undefined
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
    items,
    budgets,
    deals,
  }
}

export default useInjection
