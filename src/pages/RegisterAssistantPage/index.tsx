import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { registerAssistantUser } from 'domain/firestore'

import { Paths } from 'types'
import RegisterAssistant from 'components/templates/RegisterAssistant'
import PendingRegisterAssistant from 'components/templates/RegisterAssistant/pending'
import useInjection from './useInjection'

const RegisterAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    assistToApproverId,
    approverNickname,
  } = useInjection()

  const registerAssistantUserHandler = useCallback(
    (nickname: string) => {
      registerAssistantUser(nickname, assistToApproverId).catch((err) => {
        // eslint-disable-next-line no-alert
        window.alert(err.message)
      })
    },
    [assistToApproverId]
  )

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (!isLoaded || !approverNickname) return <div>loading...</div>

  if (renderType === 'Pending') {
    return <PendingRegisterAssistant approverNickname={approverNickname} />
  }

  if (renderType === 'Running') {
    return <Redirect to={Paths.WorkAssistant} />
  }

  return (
    <RegisterAssistant
      approverNickname={approverNickname}
      registerAssistantUserHandler={registerAssistantUserHandler}
    />
  )
}

export default RegisterAssistantPage
