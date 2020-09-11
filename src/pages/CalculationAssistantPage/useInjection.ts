import { useState, useEffect, useContext } from 'react'
import * as firebase from 'firebase/app'

import { Roles, Status, Now } from 'types'
import { fetchNickName } from 'domain/firestore'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export type RenderType = 'NotFound' | 'Calculation' | 'Running'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  totalPrice: number
  unApprovePrice: number
  approverNickName: string
}

const useInjection = (): ResultProps => {
  const myUserId = firebase.auth().currentUser?.uid

  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)

  const { isContentsContextLoaded, now, deals } = useContext(ContentsContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Calculation')
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

    if (userInfo.state === Status.Running) {
      setRenderType('Running')
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
  const calculatedUnApprovePrice = deals.reduce((prev, next) => {
    if (!next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  return {
    isLoaded: isAuthorizeContextLoaded && isContentsContextLoaded,
    renderType,
    now,
    totalPrice: calculatedTotalPrice,
    unApprovePrice: calculatedUnApprovePrice,
    approverNickName,
  }
}

export default useInjection