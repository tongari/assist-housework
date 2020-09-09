import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import WorkApprover from 'components/templates/WorkApprover'
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
    />
  )
}

export default WorkApproverPage
