import React from 'react'
import * as firebase from 'firebase/app'
import { registerAssistantUser } from 'domain/firestore'
import { useDocument } from 'react-firebase-hooks/firestore'
import RegisterAssistant from 'components/templates/RegisterAssistant'
import PendingRegisterAssistant from 'components/templates/RegisterAssistant/pending'

const RegisterAssistantPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const assistToApproverId = searchParams.get('invite_assistant')

  const [assistToApprovers] = useDocument(
    firebase
      .firestore()
      .doc(
        `users/${
          firebase.auth().currentUser?.uid
        }/assistToApprovers/${assistToApproverId}`
      ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  const registerAssistantUserHandler = (nickName: string) => {
    registerAssistantUser(nickName, assistToApproverId).catch((err) => {
      // eslint-disable-next-line no-alert
      window.alert(err.message)
    })
  }

  return (
    <>
      {assistToApprovers?.get('assistToApproverId') ? (
        <PendingRegisterAssistant
          approverNickName={searchParams.get('approver_nick_name') ?? ''}
        />
      ) : (
        <RegisterAssistant
          approverNickName={searchParams.get('approver_nick_name') ?? ''}
          registerAssistantUserHandler={registerAssistantUserHandler}
        />
      )}
    </>
  )
}

export default RegisterAssistantPage
