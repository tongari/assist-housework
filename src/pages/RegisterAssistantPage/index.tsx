import React from 'react'
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
    approverNickName,
  } = useInjection()

  const registerAssistantUserHandler = (nickName: string) => {
    registerAssistantUser(nickName, assistToApproverId).catch((err) => {
      // eslint-disable-next-line no-alert
      window.alert(err.message)
    })
  }

  if (isLoaded && renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (!isLoaded || !approverNickName) return <div>loading...</div>

  if (renderType === 'Pending') {
    return <PendingRegisterAssistant approverNickName={approverNickName} />
  }

  return (
    <RegisterAssistant
      approverNickName={approverNickName}
      registerAssistantUserHandler={registerAssistantUserHandler}
    />
  )
}

export default RegisterAssistantPage
