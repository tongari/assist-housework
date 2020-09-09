import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Paths, Item } from 'types'
import WorkAssistant from 'components/templates/WorkAssistant'
import { addDeal } from 'domain/firestore'
import useInjection from './useInjection'

const WorkAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    now,
    items,
    budget,
    totalPrice,
    unApprovePrice,
    approverNickName,
  } = useInjection()

  const addDealHandler = useCallback(
    (item: Item) => {
      addDeal(now, item)
    },
    [now]
  )

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
      unApprovePrice={unApprovePrice}
      addDealHandler={addDealHandler}
    />
  )
}

export default WorkAssistantPage
