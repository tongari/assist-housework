import * as firebase from 'firebase/app'

// TODO: ちょっと模索中

type CreateTestResultType = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>
// eslint-disable-next-line import/prefer-default-export
export const createTest = async (
  cnt: number
): Promise<CreateTestResultType> => {
  const db = firebase.firestore()
  const result = await db.collection('tests').add({
    cnt,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
  })
  return result
}
