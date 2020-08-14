import React, { useState } from 'react'
import { testSave } from 'domain/firestore'
import * as firebase from 'firebase/app'
import { useCollection } from 'react-firebase-hooks/firestore'

const RegisterApproverPage: React.FC = () => {
  const [cnt, setCnt] = useState(1)
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('test').orderBy('created_at', 'desc'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  const onSave: React.FormEventHandler = (e) => {
    e.preventDefault()
    // TODO: ちょっと模索中
    testSave(cnt)
    setCnt(cnt + 1)
  }

  return (
    <div>
      <h1>お手伝いをお願いしよう。</h1>
      <form>
        <label>
          <p>ニックネーム（50文字以内）</p>
          <input type="text" maxLength={50} />
        </label>
        <label>
          <p>お手伝いをお願いする人のメールアドレスまたは、電話番号</p>
          <input type="text" />
        </label>
        <button type="submit" onClick={onSave}>
          登録
        </button>
      </form>
      <div>
        {error && <p>Error: {JSON.stringify(error)}</p>}
        {loading && <p>Collection: Loading...</p>}
        {value && (
          <>
            <p>Collection:</p>
            <ul>
              {value.docs.map((doc) => {
                return (
                  <React.Fragment key={doc.id}>
                    <li>docID: {doc.id}</li>
                    <li>cnt: {doc.get('cnt')}</li>
                  </React.Fragment>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterApproverPage
