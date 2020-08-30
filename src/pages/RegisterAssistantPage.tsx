import React from 'react'
import * as firebase from 'firebase/app'
import { registerAssistantUser } from 'domain/firestore'
import { useDocument } from 'react-firebase-hooks/firestore'
import RegisterAssistant from 'components/templates/RegisterAssistant'
import PendingRegisterAssistant from 'components/templates/RegisterAssistant/pending'

const RegisterAssistantPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const assistToApproverId = searchParams.get('invite_assistant')
  const approverNickName = searchParams.get('approver_nick_name') ?? ''

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

  if (!assistToApprovers) return null

  return (
    <>
      {assistToApprovers.data() ? (
        <PendingRegisterAssistant approverNickName={approverNickName} />
      ) : (
        <RegisterAssistant
          approverNickName={approverNickName}
          registerAssistantUserHandler={registerAssistantUserHandler}
        />
      )}
    </>
  )
}

export default RegisterAssistantPage