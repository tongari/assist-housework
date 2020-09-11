import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import CalculationApprover from 'components/templates/CalculationApprover'
import useInjection from './useInjection'

const CalculationApproverPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    totalPrice,
    unApprovePrice,
    assistantNickname,
  } = useInjection()

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Running') {
    return <Redirect to={Paths.WorkApprover} />
  }

  if (!isLoaded || !assistantNickname) return <div>loading...</div>

  return (
    <CalculationApprover
      now={now}
      totalPrice={totalPrice}
      unApprovePrice={unApprovePrice}
      assistantNickname={assistantNickname}
    />
  )
}

export default CalculationApproverPage
