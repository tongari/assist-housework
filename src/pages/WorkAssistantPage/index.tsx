import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import WorkAssistant from 'components/templates/WorkAssistant'
import useInjection from './useInjection'

const WorkAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    items,
    budget,
    totalPrice,
    approverNickName,
  } = useInjection()

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (!isLoaded || !approverNickName) return <div>loading...</div>

  return (
    <WorkAssistant
      approverNickName={approverNickName}
      now={now}
      items={items}
      budget={budget}
      totalPrice={totalPrice}
    />
  )
}

export default WorkAssistantPage
