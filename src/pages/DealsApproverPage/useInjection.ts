import { useState, useEffect, useContext } from 'react'

import { Roles, Status, GroupDateDeal, Now } from 'types'
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
  assistantNickname?: string
}

const useInjection = (): ResultProps => {
  const { userInfo } = useContext(AuthorizedContext)

  const { now, assistantNickname } = useContext(ContentsContext)
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

    if (userInfo.state === Status.Calculation) {
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
    assistantNickname,
  }
}

export default useInjection
