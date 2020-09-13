import { useState, useEffect, useContext } from 'react'

import { fetchNickname } from 'domain/firestore'
import { Roles, Status, Item, Now } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'
import { RunningContext } from 'contexts/RunningProvider'

export type RenderType = 'NotFound' | 'Running' | 'Calculation'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  items: Item[]
  budget: number
  totalPrice: number
  unApprovePrice: number
  approverNickname: string
}

const useInjection = (): ResultProps => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)
  const { now, items, todayDeals } = useContext(ContentsContext)
  const {
    isRunningContextLoaded,
    budget,
    totalPrice,
    isNotFound,
    unApprovePrice,
  } = useContext(RunningContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Running')
  const [approverNickname, setApproverNickname] = useState<string>('')

  useEffect(() => {
    let isCleaned = false
    if (isAuthorizeContextLoaded && userInfo?.watchId) {
      fetchNickname(userInfo?.watchId).then((v) => {
        if (!isCleaned) setApproverNickname(v.data.nickname)
      })
    }
    return () => {
      isCleaned = true
    }
  }, [isAuthorizeContextLoaded, userInfo])

  useEffect(() => {
    if (!isRunningContextLoaded) return

    if (isNotFound) {
      setRenderType('NotFound')
      return
    }

    if (userInfo?.role !== Roles.Assistant) {
      setRenderType('NotFound')
      return
    }

    if (userInfo?.state === Status.Calculation) {
      setRenderType('Calculation')
    }
  }, [isRunningContextLoaded, userInfo, isNotFound])

  const compactedItems = items.filter((item) => item.label !== null)

  const addedIsWorkedToItems = compactedItems.map((item) => {
    const existDeal = todayDeals.find((deal) => deal.itemId === item.itemId)
    if (existDeal) {
      return { ...item, isWorked: true }
    }
    return item
  })

  return {
    isLoaded: isRunningContextLoaded,
    renderType,
    now,
    items: addedIsWorkedToItems,
    budget,
    totalPrice,
    unApprovePrice,
    approverNickname,
  }
}

export default useInjection
