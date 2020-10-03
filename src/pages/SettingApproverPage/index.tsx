import React, { useCallback } from 'react'
import { Redirect, useHistory } from 'react-router-dom'

import { Paths, Item, Budget } from 'types'
import { settingAssistContents } from 'domain/firestore'
import Loader from 'components/molecules/Loader'
import SettingApprover from 'components/templates/SettingApprover'
import useInjection from './useInjection'

const SettingApproverPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    assistantNickname,
    now,
    items,
    budgets,
    calculatedPrice,
  } = useInjection()

  const history = useHistory()

  const settingAssistContentsHandler = useCallback(
    (editItems: Item[], editBudget: Budget) => {
      settingAssistContents(editItems, editBudget, now).then(() => {
        history.push(Paths.WorkApprover)
      })
    },
    [now, history]
  )

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
        <SettingApprover
          assistantNickname={assistantNickname}
          now={now}
          items={items}
          budgets={budgets}
          calculatedPrice={calculatedPrice}
          settingAssistContentsHandler={settingAssistContentsHandler}
        />
      )}
    </>
  )
}

export default SettingApproverPage
