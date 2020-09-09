import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import { approveDeal } from 'domain/firestore'
import DealsApprover from 'components/templates/DealsApprover'
import useInjection from './useInjection'

const DealsApproverPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    deals,
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

  if (!isLoaded || !assistantNickname) return <div>loading...</div>

  return (
    <DealsApprover
      assistantNickname={assistantNickname}
      now={now}
      deals={deals}
      budget={budget}
      totalPrice={totalPrice}
      unApprovePrice={unApprovePrice}
      approveDealHandler={approveDealHandler}
    />
  )
}

export default DealsApproverPage
