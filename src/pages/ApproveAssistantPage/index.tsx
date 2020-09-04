import React from 'react'
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
    assistantNickName,
  } = useInjection()

  const setApprovedAssistantHandler = () => {
    if (assistantUserId) {
      setApprovedAssistant(assistantUserId)
    }
  }

  if (!isLoaded || !assistantNickName) return <div>loading...</div>

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Setting') {
    return <div>セッティング画面へ</div>
  }

  return (
    <ApproveAssistant
      assistantNickName={assistantNickName}
      setApprovedAssistantHandler={setApprovedAssistantHandler}
    />
  )
}

export default ApproveAssistantPage
