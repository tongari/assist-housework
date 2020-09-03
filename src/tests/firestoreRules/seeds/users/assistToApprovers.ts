import * as firebase from '@firebase/testing'
import { PROJECT_ID } from 'tests/config'

export const userAssistToApproversSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  await adminDb
    .collection('users/assistant_1/assistToApprovers')
    .doc('approver_1')
    .set({
      assistToApproverId: 'approver_1',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  await adminDb
    .collection('users/assistant_1/assistToApprovers')
    .doc('approver_11')
    .set({
      assistToApproverId: 'approver_11',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  await adminDb
    .collection('users/assistant_2/assistToApprovers')
    .doc('approver_2')
    .set({
      assistToApproverId: 'approver_2',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}
