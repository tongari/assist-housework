import * as firebase from 'firebase/app'

// TODO: ちょっと模索中

type TestSaveResultType = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>
// eslint-disable-next-line import/prefer-default-export
export const testSave = async (cnt: number): Promise<TestSaveResultType> => {
  const db = firebase.firestore()
  const result = await db.collection('test').add({
    cnt,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
  })
  return result
}
