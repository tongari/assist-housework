import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../../config'

export const userItemsSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  await adminDb
    .collection('users/assistant_1/assistToApprovers/approver_1/items')
    .doc('1')
    .set({
      itemId: '1',
      name: '掃除',
      price: 100,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  adminDb
    .collection('users/assistant_1/assistToApprovers/approver_11/items')
    .doc('2')
    .set({
      itemId: '1',
      name: '掃除',
      price: 200,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  await adminDb
    .collection('users/assistant_2/assistToApprovers/approver_2/items')
    .doc('1')
    .set({
      itemId: '1',
      name: '掃除',
      price: 100,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}
