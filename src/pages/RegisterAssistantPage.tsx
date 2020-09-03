import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { registerAssistantUser, fetchNickName } from 'domain/firestore'

import { Roles, Status, Paths } from 'types'

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

  const [assistToApprovers] = useCollection(
    firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser?.uid}/assistToApprovers`)
  )

  const registerAssistantUserHandler = (nickName: string) => {
    registerAssistantUser(nickName, assistToApproverId).catch((err) => {
      // eslint-disable-next-line no-alert
      window.alert(err.message)
    })
  }

  useEffect(() => {
    if (!userDoc) return
    const roleRef = userDoc?.get('roleRef')

    if (roleRef.id !== Roles.Assistant) {
      setIsRender(false)
      return
    }
    const watchId = userDoc?.get('watchId')
    if (assistToApproverId || watchId) {
      fetchNickName(assistToApproverId || watchId).then((v) => {
        setApproverNickName(v.data.nickName)
      })
    }

    if (assistToApproverId) {
      setIsRender(true)
      return
    }

    const assistToApproversDoc = assistToApprovers?.docs.find((doc) => {
      return doc.id === watchId
    })
    if (assistToApproversDoc?.get('statusRef').id === Status.Register) {
      setIsRender(true)
    }
  }, [userDoc, assistToApproverId, assistToApprovers])

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
