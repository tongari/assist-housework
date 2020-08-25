import React, { useEffect } from 'react'
import * as firebase from 'firebase/app'
import { useDocument } from 'react-firebase-hooks/firestore'
import { useHistory } from 'react-router-dom'
import { Paths } from 'config/paths'

const PendingRegisterAssistantPage: React.FC = () => {
  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  const history = useHistory()

  useEffect(() => {
    if (history && userDoc?.get('inviteAddress') === null) {
      history.push(Paths.RegisterApprover)
    }
  }, [userDoc, history])

  // TODO: テストコード。後で消す
  const onClick: React.UIEventHandler = async (e) => {
    e.preventDefault()
    const addMessage = firebase.functions().httpsCallable('addMessage')
    const response = await addMessage({ text: 'click!?' })
    // eslint-disable-next-line no-console
    console.log(response.data)
  }

  if (!userDoc) return null
  return (
    <div>
      <p>
        ただいま、
        <br />
        <strong>{userDoc?.get('inviteAddress')}</strong>
        <br />
        さんの登録待ちです。
      </p>
      <button type="button" onClick={onClick}>
        get functions data
      </button>
    </div>
  )
}

export default PendingRegisterAssistantPage
