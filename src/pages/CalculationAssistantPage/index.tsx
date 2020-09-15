import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import Loader from 'components/molecules/Loader'
import CalculationAssistant from 'components/templates/CalculationAssistant'
import useInjection from './useInjection'

const CalculationAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    totalPrice,
    unApprovePrice,
    approverNickname,
    watchMonth,
  } = useInjection()

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Running') {
    return <Redirect to={Paths.WorkAssistant} />
  }

  return (
    <>
      <Loader isLoading={!isLoaded || !approverNickname} />
      {isLoaded && approverNickname && (
        <CalculationAssistant
          now={now}
          totalPrice={totalPrice}
          unApprovePrice={unApprovePrice}
          approverNickname={approverNickname}
          watchMonth={watchMonth}
        />
      )}
    </>
  )
}

export default CalculationAssistantPage
