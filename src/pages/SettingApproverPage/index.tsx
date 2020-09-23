import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

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
  } = useInjection()

  const settingAssistContentsHandler = useCallback(
    (editItems: Item[], editBudget: Budget) => {
      settingAssistContents(editItems, editBudget, now)
    },
    [now]
  )

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
        <SettingApprover
          assistantNickname={assistantNickname}
          now={now}
          items={items}
          budgets={budgets}
          settingAssistContentsHandler={settingAssistContentsHandler}
        />
      )}
    </>
  )
}

export default SettingApproverPage
