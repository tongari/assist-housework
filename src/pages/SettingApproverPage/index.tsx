import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Paths, Item, Budget } from 'types'
import { settingAssistContents } from 'domain/firestore'
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
    (editItems: Item[], editBudgets: Budget[]) => {
      settingAssistContents(editItems, editBudgets, now)
    },
    [now]
  )

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (!isLoaded || !assistantNickname) return <div>loading...</div>

  return (
    <SettingApprover
      assistantNickname={assistantNickname}
      now={now}
      items={items}
      budgets={budgets}
      settingAssistContentsHandler={settingAssistContentsHandler}
    />
  )
}

export default SettingApproverPage
