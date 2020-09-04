import * as firebase from 'firebase/app'
import { Roles, Status } from 'types'

// NOTE: 模索中(firestoreを直接叩く場合は、redux-toolkit必要ないか？)

export const registerApprovalUser = async (
  nickName: string,
  inviteAddress: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const userId = firebase.auth().currentUser?.uid
  await db
    .collection('users')
    .doc(userId)
    .set({
      userId,
      nickName,
      inviteAddress,
      roleRef: rolesRef.doc(Roles.Approver),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
    throw new Error('招待されたメールのURLから登録してください')
  }

  const addAssistantUserIds = firebase
    .functions()
    .httpsCallable('addAssistantUserIds')

  await addAssistantUserIds({ approverId: assistToApproverId }).catch((err) => {
    throw err
  })

  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const statusRef = db.collection('status')
  const userId = firebase.auth().currentUser?.uid

  const userDoc = db.collection('users').doc(userId)
  await userDoc.set({
    userId,
    nickName,
    roleRef: rolesRef.doc(Roles.Assistant),
    watchId: assistToApproverId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })
  await userDoc
    .collection('assistToApprovers')
    .doc(assistToApproverId)
    .set({
      assistToApproverId,
      statusRef: statusRef.doc(Status.Register),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  const sendApproveAssistantToApprover = firebase
    .functions()
    .httpsCallable('sendApproveAssistantToApprover')

  await sendApproveAssistantToApprover({
    approverId: assistToApproverId,
  }).catch((err) => {
    throw err
  })
}

export const setApprovedAssistant = (assistantId: string): Promise<void> => {
  const db = firebase.firestore()
  const status = db.collection('status')

  db.collection(`users/${firebase.auth().currentUser?.uid}/assistantUserIds`)
    .doc(assistantId)
    .update({
      statusRef: status.doc(Status.Setting),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  return db
    .collection(`users/${assistantId}/assistToApprovers`)
    .doc(firebase.auth().currentUser?.uid)
    .update({
      statusRef: status.doc(Status.Setting),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}

export const fetchNickName = async (
  userId: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const getNickName = firebase.functions().httpsCallable('getNickName')
  return getNickName({ userId })
}
