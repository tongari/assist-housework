import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import { useDocument } from 'react-firebase-hooks/firestore'
import { useHistory } from 'react-router-dom'
import { registerUser } from 'domain/firestore'
import { Paths } from 'config/paths'

const RegisterApproverPage: React.FC = () => {
  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  const history = useHistory()
  const [nickName, setNickName] = useState('')
  const [inviteAddress, setInviteAddress] = useState('')

  useEffect(() => {
    if (history && userDoc?.get('inviteAddress')) {
      history.push(Paths.PendingRegisterAssistant)
    }
  }, [userDoc, history])

  return (
    <div>
      <h1>お手伝いをお願いしよう。</h1>
      <form>
        <label>
          <p>ニックネーム（50文字以内）</p>
          <input
            type="text"
            maxLength={50}
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value)
            }}
          />
        </label>
        <label>
          <p>お手伝いをお願いする人のメールアドレス</p>
          <input
            type="text"
            value={inviteAddress}
            onChange={(e) => {
              setInviteAddress(e.target.value)
            }}
          />
        </label>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            registerUser(nickName, inviteAddress)
          }}
        >
          登録
        </button>
      </form>
    </div>
  )
}

export default RegisterApproverPage
