import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../config'

// eslint-disable-next-line import/prefer-default-export
export const rolesSeed = async (): Promise<void> => {
  const adminDb = (): firebase.firestore.Firestore =>
    firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore()

  await adminDb().collection('roles').doc('1').set({
    role: 'admin',
  })
  await adminDb().collection('roles').doc('2').set({
    role: 'approver',
  })
  await adminDb().collection('roles').doc('3').set({
    role: 'assistant',
  })

  const rolesRef = adminDb().collection('roles')
  await adminDb()
    .collection('users')
    .doc('approver_1')
    .set({
      userId: 'approver_1',
      nickName: 'approver_1 san',
      assistantUserIds: ['assistant_1', 'assistant_2'],
      roleRef: rolesRef.doc('2'),
      // assistToUsers: admin
      //   .collection('assistToUsers')
      //   .doc('assistant_1')
      //   .set({
      //     assistToUserId: 'assistant_1',
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //   }),
    })
  await adminDb()
    .collection('users')
    .doc('approver_2')
    .set({
      userId: 'approver_2',
      nickName: 'approver_2 san',
      assistantUserIds: ['assistant_11', 'assistant_22'],
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
}
