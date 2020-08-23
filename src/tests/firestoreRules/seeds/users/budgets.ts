import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../../config'

export const userBudgetsSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  await adminDb
    .collection('users/assistant_1/assistToApprovers/approver_1/budgets')
    .doc('1')
    .set({
      year: 2020,
      month: 8,
      budget: 3000,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  await adminDb
    .collection('users/assistant_1/assistToApprovers/approver_11/budgets')
    .doc('1')
    .set({
      year: 2020,
      month: 8,
      budget: 3000,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  await adminDb
    .collection('users/assistant_2/assistToApprovers/approver_2/budgets')
    .doc('1')
    .set({
      year: 2020,
      month: 8,
      budget: 3000,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}
