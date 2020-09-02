import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useDocument } from 'react-firebase-hooks/firestore'
import { registerAssistantUser, fetchNickName } from 'domain/firestore'

import { Roles } from 'config/roles'
import { Status } from 'config/status'
import { Paths } from 'config/paths'

import RegisterAssistant from 'components/templates/RegisterAssistant'
import PendingRegisterAssistant from 'components/templates/RegisterAssistant/pending'

const RegisterAssistantPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const assistToApproverId = searchParams.get('invite_assistant') ?? null

  const [approverNickName, setApproverNickName] = useState<string>('')
  const [isRender, setIsRender] = useState<boolean | null>(null)

  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`)
  )

  // TODO: リファクタ
  const settingStatus = async (approverId: string) => {
    const assistToApprovers = firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser?.uid}/assistToApprovers`)
      .doc(approverId)

    const assistToApproversDoc = await assistToApprovers.get()
    if (assistToApproversDoc.get('statusRef').id === Status.Register) {
      setIsRender(true)
    }
  }

  const registerAssistantUserHandler = (nickName: string) => {
    registerAssistantUser(nickName, assistToApproverId).catch((err) => {
      // eslint-disable-next-line no-alert
      window.alert(err.message)
    })
  }

  useEffect(() => {
    const roleRef = userDoc?.get('roleRef')
    if (roleRef && roleRef.id !== Roles.Assistant) {
      setIsRender(false)
      return
    }

    if (assistToApproverId) {
      setIsRender(true)
      fetchNickName(assistToApproverId).then((v) => {
        setApproverNickName(v.data.nickName)
      })
      return
    }

    const watchId = userDoc?.get('watchId')
    if (watchId) {
      settingStatus(watchId)
      fetchNickName(watchId).then((v) => {
        setApproverNickName(v.data.nickName)
      })
    }
  }, [userDoc, assistToApproverId])

  if (!userDoc || isRender === null) return null

  if (!isRender) {
    return <Redirect to={Paths.NotFound} />
  }

  return (
    <>
      {userDoc.data() ? (
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
