import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import CalculationAssistant from 'components/templates/CalculationAssistant'
import useInjection from './useInjection'

const CalculationAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    totalPrice,
    unApprovePrice,
    approverNickName,
  } = useInjection()

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Running') {
    return <Redirect to={Paths.WorkAssistant} />
  }

  if (!isLoaded || !approverNickName) return <div>loading...</div>

  return (
    <CalculationAssistant
      now={now}
      totalPrice={totalPrice}
      unApprovePrice={unApprovePrice}
      approverNickName={approverNickName}
    />
  )
}

export default CalculationAssistantPage
