import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useDocument } from 'react-firebase-hooks/firestore'

import {
  getAssistantUserIdsDoc,
  setApprovedAssistant,
  fetchNickName,
} from 'domain/firestore'
import ApproveAssistant from 'components/templates/ApproveAssistant'

import { Roles } from 'config/roles'
import { Status } from 'config/status'
import { Paths } from 'config/paths'

const ApproveAssistantPage: React.FC = () => {
  const [isRender, setIsRender] = useState<boolean | null>(null)
  const [assistantNickName, setAssistantNickName] = useState('')

  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`)
  )

  useEffect(() => {
    if (!userDoc) return

    const roleRef = userDoc.get('roleRef')
    const watchId = userDoc.get('watchId')

    if (roleRef?.id !== Roles.Approver || !watchId) {
      setIsRender(false)
      return
    }

    getAssistantUserIdsDoc(watchId)
      .then((doc) => {
        if (doc.get('statusRef').id === Status.Register) {
          setIsRender(true)
        }
      })
      .catch(() => {
        setIsRender(false)
      })
    fetchNickName(watchId).then((v) => {
      setAssistantNickName(v.data.nickName)
    })
  }, [userDoc])

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
