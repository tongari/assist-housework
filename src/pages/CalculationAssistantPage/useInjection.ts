import { useState, useEffect, useContext } from 'react'

import { Roles, Status, Now } from 'types'
import { fetchNickname } from 'domain/firestore'
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
  approverNickname: string
  watchMonth: string
}

const useInjection = (): ResultProps => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)
  const { now } = useContext(ContentsContext)
  const {
    isCalculationContextLoaded,
    totalPrice,
    unApprovePrice,
    watchMonth,
    isNotFound,
  } = useContext(CalculationContext)

  // local state
  const [renderType, setRenderType] = useState<RenderType>('Calculation')
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
    if (!isCalculationContextLoaded) return

    if (isNotFound) {
      setRenderType('NotFound')
      return
    }

    if (userInfo?.role !== Roles.Assistant) {
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
    approverNickname,
    watchMonth,
  }
}

export default useInjection
