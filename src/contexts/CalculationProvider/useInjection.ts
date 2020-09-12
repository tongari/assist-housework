import { useContext, useEffect, useState } from 'react'

import { Status } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export interface InjectionResult {
  isCalculationContextLoaded: boolean
  totalPrice: number
  unApprovePrice: number
  watchMonth: string
  isNotFound: boolean | null
}

const useInjection = (): InjectionResult => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)
  const { isContentsContextLoaded, calculationDeals } = useContext(
    ContentsContext
  )
  const [isNotFound, setIsNotFound] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isAuthorizeContextLoaded || !isContentsContextLoaded) return

    if (!userInfo) {
      setIsNotFound(true)
      return
    }

    if (
      !(userInfo.state === Status.Running) &&
      !(userInfo.state === Status.Calculation)
    ) {
      setIsNotFound(true)
      return
    }
    setIsNotFound(false)
  }, [isAuthorizeContextLoaded, isContentsContextLoaded, userInfo])

  const calculatedTotalPrice = calculationDeals.reduce((prev, next) => {
    if (next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  const calculatedUnApprovePrice = calculationDeals.reduce((prev, next) => {
    if (!next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  return {
    isCalculationContextLoaded:
      isAuthorizeContextLoaded &&
      isContentsContextLoaded &&
      isNotFound !== null,
    totalPrice: calculatedTotalPrice,
    unApprovePrice: calculatedUnApprovePrice,
    watchMonth: userInfo?.month ?? '',
    isNotFound,
  }
}

export default useInjection
