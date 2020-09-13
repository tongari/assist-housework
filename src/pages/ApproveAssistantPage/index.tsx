import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { setApprovedAssistant } from 'domain/firestore'
import ApproveAssistant from 'components/templates/ApproveAssistant'
import { Paths } from 'types'
import useInjection from './useInjection'

const ApproveAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    assistantUserId,
    assistantNickname,
  } = useInjection()

  const setApprovedAssistantHandler = useCallback(() => {
    if (assistantUserId) {
      setApprovedAssistant(assistantUserId)
    }
  }, [assistantUserId])

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (!isLoaded || !assistantNickname) return <div>loading...</div>

  if (renderType === 'Setting') {
    return <Redirect to={Paths.SettingApprover} />
  }

  return (
    <ApproveAssistant
      assistantNickname={assistantNickname}
      setApprovedAssistantHandler={setApprovedAssistantHandler}
    />
  )
}

export default ApproveAssistantPage
