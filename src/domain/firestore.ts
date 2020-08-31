import * as firebase from 'firebase/app'
import { Roles } from 'config/roles'

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
      assistantUserIds: [],
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
  const userId = firebase.auth().currentUser?.uid
  await db
    .collection('users')
    .doc(userId)
    .set({
      userId,
      nickName,
      roleRef: rolesRef.doc(Roles.Assistant),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  await db
    .collection(`users/${userId}/assistToApprovers`)
    .doc(assistToApproverId)
    .set({
      assistToApproverId,
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

export const hasAssistantUserIds = async (
  assistantId: string | null
): Promise<boolean> => {
  if (!assistantId) return false

  const db = firebase.firestore()
  const approver = db.collection('users').doc(firebase.auth().currentUser?.uid)
  const approverDoc = await approver.get()
  const assistantUserIds = approverDoc.get('assistantUserIds')

  const result = assistantUserIds.includes(assistantId)
  return result
}

export const setApprovedAssistant = (
  assistantId: string | null
): Promise<void> => {
  const db = firebase.firestore()
  return db
    .collection(`users/${assistantId}/assistToApprovers`)
    .doc(firebase.auth().currentUser?.uid)
    .update({
      approved: true,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}
