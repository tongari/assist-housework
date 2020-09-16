import { useContext, useEffect, useState } from 'react'

import { Status, Deal, GroupDateDeal } from 'types/index'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import { ContentsContext } from 'contexts/ContentsProvider'

export interface InjectionResult {
  isRunningContextLoaded: boolean
  budget: number
  totalPrice: number
  unApprovePrice: number
  watchMonth: string
  isNotFound: boolean | null
  convertGroupDateDeals: (baseDeals?: Deal[]) => GroupDateDeal[]
}

const useInjection = (): InjectionResult => {
  const { isAuthorizeContextLoaded, userInfo } = useContext(AuthorizedContext)
  const { isContentsContextLoaded, budgets, deals } = useContext(
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

  const convertGroupDateDeals = (baseDeals?: Deal[]) => {
    const result: GroupDateDeal[] = []

    const tempDeals = baseDeals ?? deals

    tempDeals.forEach((deal) => {
      const findIndex = result.findIndex(
        (resultItem) => resultItem.date === deal.date
      )

      if (findIndex < 0) {
        result.push({
          month: deal.month,
          date: deal.date,
          day: deal.day,
          deals: [deal],
        })
      } else {
        result[findIndex].deals.push(deal)
      }
    })
    return result
  }

  const calculatedTotalPrice = deals.reduce((prev, next) => {
    if (next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  const calculatedUnApprovePrice = deals.reduce((prev, next) => {
    if (!next.isApproved) {
      return prev + next.price
    }
    return prev
  }, 0)

  const calcBudget = () => {
    if (budgets) {
      const base = budgets[0]?.budget ?? 0
      return base - calculatedTotalPrice - calculatedUnApprovePrice
    }
    return 0
  }

  return {
    isRunningContextLoaded:
      isAuthorizeContextLoaded &&
      isContentsContextLoaded &&
      isNotFound !== null,
    budget: calcBudget(),
    totalPrice: calculatedTotalPrice,
    unApprovePrice: calculatedUnApprovePrice,
    watchMonth: userInfo?.month ?? '',
    isNotFound,
    convertGroupDateDeals,
  }
}

export default useInjection
