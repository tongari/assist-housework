import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { setApprovedAssistant } from 'domain/firestore'
import Loader from 'components/molecules/Loader'
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

  if (renderType === 'Setting') {
    return <Redirect to={Paths.SettingApprover} />
  }

  return (
    <>
      <Loader isLoading={!isLoaded || !assistantNickname} />
      {isLoaded && assistantNickname && (
        <ApproveAssistant
          assistantNickname={assistantNickname}
          setApprovedAssistantHandler={setApprovedAssistantHandler}
        />
      )}
    </>
  )
}

export default ApproveAssistantPage
