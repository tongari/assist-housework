import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import Loader from 'components/molecules/Loader'
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

  return (
    <>
      <Loader isLoading={!isLoaded || !approverNickname} />
      {isLoaded && approverNickname && (
        <DealsAssistant
          approverNickname={approverNickname}
          now={now}
          groupedDateDeals={groupedDateDeals}
          budget={budget}
          totalPrice={totalPrice}
          unApprovePrice={unApprovePrice}
        />
      )}
    </>
  )
}

export default DealsAssistantPage
