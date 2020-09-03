import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'

import { setApprovedAssistant, fetchNickName } from 'domain/firestore'
import ApproveAssistant from 'components/templates/ApproveAssistant'
import { Roles, Status, Paths } from 'types'

const ApproveAssistantPage: React.FC = () => {
  const [isRender, setIsRender] = useState<boolean | null>(null)
  const [assistantNickName, setAssistantNickName] = useState('')

  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`)
  )

  const [assistantUserIds] = useCollection(
    firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser?.uid}/assistantUserIds`)
  )

  useEffect(() => {
    if (!userDoc) return

    const roleRef = userDoc.get('roleRef')
    const watchId = userDoc.get('watchId')

    if (roleRef?.id !== Roles.Approver || !watchId) {
      setIsRender(false)
      return
    }

    const assistantUserIdsDoc = assistantUserIds?.docs.find((doc) => {
      return doc.id === watchId
    })
    if (assistantUserIdsDoc?.get('statusRef').id === Status.Register) {
      setIsRender(true)
    }

    fetchNickName(watchId).then((v) => {
      setAssistantNickName(v.data.nickName)
    })
  }, [userDoc, assistantUserIds])

  const setApprovedAssistantHandler = () => {
    setApprovedAssistant(userDoc?.get('watchId'))
  }

  if (!userDoc || isRender === null) return null

  if (!isRender) {
    return <Redirect to={Paths.NotFound} />
  }

  return (
    <>
      <ApproveAssistant
        assistantNickName={assistantNickName}
        setApprovedAssistantHandler={setApprovedAssistantHandler}
      />
    </>
  )
}

export default ApproveAssistantPage
