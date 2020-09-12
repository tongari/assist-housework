import { useState, useEffect, useContext } from 'react'

import { Roles, Status, Now, GroupDateDeal } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'
import { RunningContext } from 'contexts/RunningProvider'

export type RenderType = 'NotFound' | 'Running' | 'Calculation'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  budget: number
  totalPrice: number
  assistantNickname?: string
  unApprovePrice: number
  groupedDateDeals: GroupDateDeal[]
}

const useInjection = (): ResultProps => {
  const { userInfo } = useContext(AuthorizedContext)
  const { now, deals, assistantNickname } = useContext(ContentsContext)
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

  useEffect(() => {
    if (!isRunningContextLoaded) return

    if (isNotFound) {
      setRenderType('NotFound')
      return
    }

    if (userInfo?.role !== Roles.Approver) {
      setRenderType('NotFound')
      return
    }

    if (userInfo?.state === Status.Calculation) {
      setRenderType('Calculation')
    }
  }, [isRunningContextLoaded, userInfo, isNotFound])

  const excludedIsApprovedDeal = deals.filter((deal) => !deal.isApproved)

  return {
    isLoaded: isRunningContextLoaded,
    renderType,
    now,
    groupedDateDeals: convertGroupDateDeals(excludedIsApprovedDeal),
    budget,
    totalPrice,
    unApprovePrice,
    assistantNickname,
  }
}

export default useInjection
