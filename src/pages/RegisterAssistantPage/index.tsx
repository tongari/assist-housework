import React, { useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { registerAssistantUser } from 'domain/firestore'

import { Paths } from 'types'
import Loader from 'components/molecules/Loader'
import RegisterAssistant from 'components/templates/RegisterAssistant'
import PendingRegisterAssistant from 'components/templates/RegisterAssistant/pending'
import useInjection from './useInjection'

const RegisterAssistantPage: React.FC = () => {
  const {
    isLoaded,
    renderType,
    assistToApproverId,
    inviteToken,
    approverNickname,
  } = useInjection()

  const registerAssistantUserHandler = useCallback(
    (nickname: string) => {
      registerAssistantUser(nickname, assistToApproverId, inviteToken).catch(
        (err) => {
          // eslint-disable-next-line no-alert
          window.alert(err.message)
        }
      )
    },
    [assistToApproverId, inviteToken]
  )

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Pending') {
    return (
      <>
        <Loader isLoading={!isLoaded || !approverNickname} />
        {isLoaded && approverNickname && (
          <PendingRegisterAssistant approverNickname={approverNickname} />
        )}
      </>
    )
  }

  if (renderType === 'Running') {
    return <Redirect to={Paths.WorkAssistant} />
  }

  return (
    <>
      <Loader isLoading={!isLoaded || !approverNickname} />
      {isLoaded && approverNickname && (
        <RegisterAssistant
          approverNickname={approverNickname}
          registerAssistantUserHandler={registerAssistantUserHandler}
        />
      )}
    </>
  )
}

export default RegisterAssistantPage
