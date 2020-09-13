import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import DealsAssistant from 'components/templates/DealsAssistant'
import useInjection from './useInjection'

const DealsAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    groupedDateDeals,
    budget,
    totalPrice,
    unApprovePrice,
    approverNickname,
  } = useInjection()

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Calculation') {
    return <Redirect to={Paths.CalculationAssistant} />
  }

  if (!isLoaded || !approverNickname) return <div>loading...</div>

  return (
    <DealsAssistant
      approverNickname={approverNickname}
      now={now}
      groupedDateDeals={groupedDateDeals}
      budget={budget}
      totalPrice={totalPrice}
      unApprovePrice={unApprovePrice}
    />
  )
}

export default DealsAssistantPage
