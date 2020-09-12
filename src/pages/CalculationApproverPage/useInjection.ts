import { useState, useEffect, useContext } from 'react'

import { Roles, Status, Now } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'
import { CalculationContext } from 'contexts/CalculationProvider'

export type RenderType = 'NotFound' | 'Calculation' | 'Running'

type ResultProps = {
  isLoaded: boolean
  renderType: RenderType
  now: Now
  totalPrice: number
  unApprovePrice: number
  watchMonth: string
  assistantNickname?: string
}

const useInjection = (): ResultProps => {
  const { userInfo } = useContext(AuthorizedContext)
  const { now, assistantNickname } = useContext(ContentsContext)
  const {
    isCalculationContextLoaded,
    totalPrice,
    unApprovePrice,
    watchMonth,
    isNotFound,
  } = useContext(CalculationContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Calculation')

  useEffect(() => {
    if (!isCalculationContextLoaded) return

    if (isNotFound) {
      setRenderType('NotFound')
      return
    }

    if (userInfo?.role !== Roles.Approver) {
      setRenderType('NotFound')
      return
    }

    if (userInfo?.state === Status.Running) {
      setRenderType('Running')
    }
  }, [isCalculationContextLoaded, userInfo, isNotFound])

  return {
    isLoaded: isCalculationContextLoaded,
    renderType,
    now,
    totalPrice,
    unApprovePrice,
    watchMonth,
    assistantNickname,
  }
}

export default useInjection
