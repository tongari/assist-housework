import React, { useState } from 'react'
import { createTest } from 'domain/firestore'
import * as firebase from 'firebase/app'
import { useCollection } from 'react-firebase-hooks/firestore'

const RegisterApproverPage: React.FC = () => {
  const [cnt, setCnt] = useState(1)
  const [value, loading, error] = useCollection(
    firebase
      .firestore()
      .collection('tests')
      .orderBy('created_at', 'desc')
      .limit(3),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  const onSave: React.FormEventHandler = (e) => {
    e.preventDefault()
    // TODO: ちょっと模索中
    createTest(cnt)
    setCnt(cnt + 1)
  }

  const onDelete: React.UIEventHandler = (e) => {
    e.preventDefault()
    if (value) {
      const testRef = firebase
        .firestore()
        .collection('test')
        .doc(value.docs[value.docs.length - 1].id)

      testRef.update({
        cnt: firebase.firestore.FieldValue.delete(),
      })
    }
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
        <button type="button" onClick={onDelete}>
          Delete last document
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
                const date = doc.get('created_at')
                const isWrittenLocal = doc.metadata.hasPendingWrites

                return (
                  <React.Fragment key={doc.id}>
                    <li>docID: {doc.id}</li>
                    <li>cnt: {doc.get('cnt')}</li>
                    <li>
                      date: {isWrittenLocal ? '' : date.toDate().toString()}
                    </li>
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
