import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import Loader from 'components/molecules/Loader'
import WorkApprover from 'components/templates/WorkApprover'
import { approveDeal } from 'domain/firestore'
import useInjection from './useInjection'

const WorkApproverPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    groupedDateDeals,
    budget,
    totalPrice,
    unApprovePrice,
    assistantNickname,
  } = useInjection()

  const approveDealHandler = useCallback((dealId: string) => {
    approveDeal(dealId)
  }, [])

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Calculation') {
    return <Redirect to={Paths.CalculationApprover} />
  }

  return (
    <>
      <Loader isLoading={!isLoaded || !assistantNickname} />
      {isLoaded && assistantNickname && (
        <WorkApprover
          assistantNickname={assistantNickname}
          now={now}
          groupedDateDeals={groupedDateDeals}
          budget={budget}
          totalPrice={totalPrice}
          unApprovePrice={unApprovePrice}
          approveDealHandler={approveDealHandler}
        />
      )}
    </>
  )
}

export default WorkApproverPage
