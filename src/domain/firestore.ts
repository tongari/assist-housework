import * as firebase from 'firebase/app'

// TODO: 模索中(firestoreを直接叩く場合は、redux-toolkit必要ないか？)

export const createUserDoc = (): void => {
  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const userId = firebase.auth().currentUser?.uid
  db.collection('users')
    .doc(userId)
    .set({
      userId,
      nickName: '',
      inviteAddress: null,
      assistantUserIds: [],
      roleRef: rolesRef.doc('2'),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}

export const registerUser = async (
  nickName: string,
  inviteAddress: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const db = firebase.firestore()
  await db.collection('users').doc(firebase.auth().currentUser?.uid).set(
    {
      nickName,
      inviteAddress,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  )

  const sendAssistantInviteMail = firebase
    .functions()
    .httpsCallable('sendAssistantInviteMail')

  const result = await sendAssistantInviteMail({ inviteAddress, nickName })
  return result
}
