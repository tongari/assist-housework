import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import WorkApprover from 'components/templates/WorkApprover'
import { approveDeal } from 'domain/firestore'
import useInjection from './useInjection'

const WorkApproverPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    deals,
    budget,
    totalPrice,
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
    <WorkApprover
      assistantNickname={assistantNickname}
      now={now}
      deals={deals}
      budget={budget}
      totalPrice={totalPrice}
      approveDealHandler={approveDealHandler}
    />
  )
}

export default WorkApproverPage
