import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../config'

// eslint-disable-next-line import/prefer-default-export
export const usersSeed = async (): Promise<void> => {
  const adminDb = (): firebase.firestore.Firestore =>
    firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore()

  const rolesRef = adminDb().collection('roles')
  await adminDb()
    .collection('users')
    .doc('approver_1')
    .set({
      userId: 'approver_1',
      nickName: 'approver_1 san',
      assistantUserIds: ['assistant_1'],
      roleRef: rolesRef.doc('2'),
    })

  await adminDb()
    .collection('users')
    .doc('approver_2')
    .set({
      userId: 'approver_2',
      nickName: 'approver_2 san',
      assistantUserIds: ['assistant_2'],
      roleRef: rolesRef.doc('2'),
    })

  await adminDb()
    .collection('users')
    .doc('assistant_1')
    .set({
      userId: 'assistant_1',
      nickName: 'assistant_1 san',
      assistantUserIds: [],
      roleRef: rolesRef.doc('3'),
    })

  await adminDb()
    .collection('users')
    .doc('assistant_2')
    .set({
      userId: 'assistant_2',
      nickName: 'assistant_2 san',
      assistantUserIds: [],
      roleRef: rolesRef.doc('3'),
    })
}
