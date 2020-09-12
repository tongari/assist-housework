import { useState, useEffect, useContext } from 'react'

import { Roles, Status, GroupDateDeal, Now } from 'types'
import { fetchNickName } from 'domain/firestore'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'
import { RunningContext } from 'contexts/RunningProvider'

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
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)
  const { now } = useContext(ContentsContext)
  const {
    isRunningContextLoaded,
    budget,
    totalPrice,
    isNotFound,
    unApprovePrice,
    convertGroupDateDeals,
  } = useContext(RunningContext)

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

  return {
    isLoaded: isRunningContextLoaded,
    renderType,
    now,
    groupedDateDeals: convertGroupDateDeals(),
    budget,
    totalPrice,
    unApprovePrice,
    approverNickName,
  }
}

export default useInjection
