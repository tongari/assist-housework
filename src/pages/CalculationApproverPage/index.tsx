import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import { fixCalculation } from 'domain/firestore'

import Loader from 'components/molecules/Loader'
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
    watchMonth,
  } = useInjection()

  const fixCalculationHandler = useCallback(() => {
    fixCalculation(now)
  }, [now])

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Running') {
    return <Redirect to={Paths.WorkApprover} />
  }

  return (
    <>
      <Loader isLoading={!isLoaded || !assistantNickname} />
      {isLoaded && assistantNickname && (
        <CalculationApprover
          now={now}
          totalPrice={totalPrice}
          unApprovePrice={unApprovePrice}
          assistantNickname={assistantNickname}
          watchMonth={watchMonth}
          fixCalculationHandler={fixCalculationHandler}
        />
      )}
    </>
  )
}

export default CalculationApproverPage
