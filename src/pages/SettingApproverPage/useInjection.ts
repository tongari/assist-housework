import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'
import { format } from 'date-fns'

import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import {
  userDocument,
  itemsCollection,
  budgetsCollection,
} from 'config/firebase'

import { Roles, Status } from 'types'
import { AuthorizedContext } from 'pages/AuthorizedProvider'

export type RenderType = 'NotFound' | 'Setting'

const year = format(new Date(), 'yyyy')
const month = format(new Date(), 'M')

const useInjection = (): {
  isLoaded: boolean
  renderType: RenderType
  assistantNickname: string
  month: string
  items:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | undefined
  budgets:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | undefined
} => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isLoaded, userInfo } = useContext(AuthorizedContext)

  // local state
  const [isScopeLoaded, setIsScopeLoaded] = useState(false)
  const [renderType, setRenderType] = useState<RenderType>('Setting')
  const [assistantNickname, setAssistantNickname] = useState<string>('')

  // fetch data
  const [assistantUserDoc, isAssistantUserDocLoading] = useDocument(
    userDocument(userInfo?.watchId)
  )

  const [items, isItemsLoading] = useCollection(
    itemsCollection(userInfo?.watchId, myUserId)
  )
  const [budgets, isBudgetsLoading] = useCollection(
    budgetsCollection(userInfo?.watchId, myUserId)
      .where('year', '==', year)
      .where('month', '==', month)
  )

  useEffect(() => {
    if (
      isLoaded ||
      !isAssistantUserDocLoading ||
      !isItemsLoading ||
      !isBudgetsLoading
    ) {
      setIsScopeLoaded(true)
    }
  }, [isLoaded, isAssistantUserDocLoading, isItemsLoading, isBudgetsLoading])

  useEffect(() => {
    if (!isLoaded) return

    if (!userInfo) {
      setRenderType('NotFound')
      return
    }

    setAssistantNickname(assistantUserDoc?.get('nickName'))

    if (userInfo.role !== Roles.Approver || userInfo.state !== Status.Setting) {
      setRenderType('NotFound')
    }
  }, [isLoaded, userInfo, assistantUserDoc, myUserId])

  return {
    isLoaded: isScopeLoaded,
    renderType,
    assistantNickname,
    month,
    items,
    budgets,
  }
}

export default useInjection
