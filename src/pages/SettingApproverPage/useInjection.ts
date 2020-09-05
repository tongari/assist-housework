import { Roles, Status } from 'types'
import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import { format } from 'date-fns'

import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import {
  userDocument,
  assistToApproversCollection,
  itemsCollection,
  budgetsCollection,
} from 'config/firebase'

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

  // local state
  const [isLoaded, setIsLoaded] = useState(false)
  const [renderType, setRenderType] = useState<RenderType>('Setting')
  const [assistantUserId, setAssistantUserId] = useState<string | null>(null)
  const [assistantNickname, setAssistantNickname] = useState<string>('')

  // fetch data
  const [myUserDoc, isMyUserDocLoading] = useDocument(userDocument())
  const [otherUserDoc, isOtherUserDocLoading] = useDocument(
    userDocument(assistantUserId)
  )
  const [assistToApprovers, isAssistToApproversLoading] = useCollection(
    assistToApproversCollection(myUserId).where(
      'assistToApproverId',
      '==',
      myUserId
    )
  )
  const [items, isItemsLoading] = useCollection(
    itemsCollection(assistantUserId, myUserId)
  )
  const [budgets, isBudgetsLoading] = useCollection(
    budgetsCollection(assistantUserId, myUserId)
      .where('year', '==', year)
      .where('month', '==', month)
  )

  useEffect(() => {
    if (
      !isMyUserDocLoading ||
      !isOtherUserDocLoading ||
      !isAssistToApproversLoading ||
      !isItemsLoading ||
      !isBudgetsLoading
    ) {
      setIsLoaded(true)
    }
  }, [
    isMyUserDocLoading,
    isOtherUserDocLoading,
    isAssistToApproversLoading,
    isItemsLoading,
    isBudgetsLoading,
  ])

  useEffect(() => {
    if (!isLoaded) return

    if (!myUserDoc?.exists) {
      setRenderType('NotFound')
      return
    }

    const roleRef = myUserDoc?.get('roleRef')
    const watchId = myUserDoc?.get('watchId')
    setAssistantUserId(watchId)

    setAssistantNickname(otherUserDoc?.get('nickName'))

    const assistToApproversDoc = assistToApprovers?.docs.find((doc) => {
      return doc.id === myUserId
    })
    const status = assistToApproversDoc?.get('statusRef')?.id

    if (
      roleRef.id !== Roles.Approver ||
      (status && status !== Status.Setting)
    ) {
      setRenderType('NotFound')
    }
  }, [isLoaded, myUserDoc, otherUserDoc, assistToApprovers, myUserId])

  return {
    isLoaded,
    renderType,
    assistantNickname,
    month,
    items,
    budgets,
  }
}

export default useInjection
