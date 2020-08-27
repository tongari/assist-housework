import * as firebase from 'firebase/app'
import { Roles } from 'config/roles'

// NOTE: 模索中(firestoreを直接叩く場合は、redux-toolkit必要ないか？)

export const createApprovalUserDoc = (): void => {
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
      roleRef: rolesRef.doc(Roles.Approver),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}

export const createAssistantUserDoc = async (
  assistToApproverId: string | null
): Promise<void> => {
  if (assistToApproverId === null) {
    // eslint-disable-next-line no-alert
    window.alert('招待されたメールのURLから登録してください')
    return
  }
  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const userId = firebase.auth().currentUser?.uid
  await db
    .collection('users')
    .doc(userId)
    .set({
      userId,
      nickName: '',
      roleRef: rolesRef.doc(Roles.Assistant),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  const addAssistantUserIds = firebase
    .functions()
    .httpsCallable('addAssistantUserIds')

  addAssistantUserIds({ approverId: assistToApproverId })
}

export const registerApprovalUser = async (
  nickName: string,
  inviteAddress: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const db = firebase.firestore()
  await db.collection('users').doc(firebase.auth().currentUser?.uid).update({
    nickName,
    inviteAddress,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })

  const sendAssistantInviteMail = firebase
    .functions()
    .httpsCallable('sendAssistantInviteMail')

  const result = await sendAssistantInviteMail({ inviteAddress, nickName })
  return result
}

export const registerAssistantUser = async (
  nickName: string,
  assistToApproverId: string | null
): Promise<void> => {
  if (assistToApproverId === null) {
    // eslint-disable-next-line no-alert
    window.alert('招待されたメールのURLから登録してください')
    return
  }

  const db = firebase.firestore()
  const userId = firebase.auth().currentUser?.uid
  await db.collection('users').doc(userId).update({
    nickName,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })

  db.collection(`users/${userId}/assistToApprovers`)
    .doc(assistToApproverId)
    .set({
      assistToApproverId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}
