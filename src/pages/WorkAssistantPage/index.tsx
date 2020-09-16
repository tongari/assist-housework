import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Paths, Item } from 'types'
import Loader from 'components/molecules/Loader'
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
    approverNickname,
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

  if (renderType === 'Calculation') {
    return <Redirect to={Paths.CalculationAssistant} />
  }

  return (
    <>
      <Loader isLoading={!isLoaded || !approverNickname} />
      {isLoaded && approverNickname && (
        <WorkAssistant
          approverNickname={approverNickname}
          items={items}
          budget={budget}
          totalPrice={totalPrice}
          unApprovePrice={unApprovePrice}
          addDealHandler={addDealHandler}
        />
      )}
    </>
  )
}

export default WorkAssistantPage
