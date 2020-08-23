import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../../config'

export const userDealsSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  await adminDb
    .collection('users/assistant_1/assistToApprovers/approver_1/deals')
    .doc('1')
    .set({
      fullDate: firebase.firestore.FieldValue.serverTimestamp(),
      year: 2020,
      month: 8,
      date: 1,
      day: 6,
      itemId: '1',
      itemName: '掃除',
      price: 100,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  await adminDb
    .collection('users/assistant_1/assistToApprovers/approver_11/deals')
    .doc('1')
    .set({
      fullDate: firebase.firestore.FieldValue.serverTimestamp(),
      year: 2020,
      month: 8,
      date: 1,
      day: 6,
      itemId: '1',
      itemName: '掃除',
      price: 100,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  await adminDb
    .collection('users/assistant_2/assistToApprovers/approver_2/deals')
    .doc('1')
    .set({
      fullDate: firebase.firestore.FieldValue.serverTimestamp(),
      year: 2020,
      month: 8,
      date: 1,
      day: 6,
      itemId: '1',
      itemName: '掃除',
      price: 100,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}
