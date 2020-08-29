import React from 'react'
import { registerAssistantUser } from 'domain/firestore'
import RegisterAssistant from 'components/templates/RegisterAssistant'

const RegisterAssistantPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search)

  const registerAssistantUserHandler = (nickName: string) => {
    const assistToApproverId = searchParams.get('invite_assistant')
    registerAssistantUser(nickName, assistToApproverId).catch((err) => {
      // eslint-disable-next-line no-alert
      window.alert(err.message)
    })
  }

  return (
    <>
      <RegisterAssistant
        approverNickName={searchParams.get('approver_nick_name') ?? ''}
        registerAssistantUserHandler={registerAssistantUserHandler}
      />
    </>
  )
}

export default RegisterAssistantPage
