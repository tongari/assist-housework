import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../../config'
import { Roles } from '../../../../config/roles'
import { Status } from '../../../../config/status'

export const usersSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  const rolesRef = adminDb.collection('roles')
  const statusRef = adminDb.collection('status')

  const approver1 = adminDb.collection('users').doc('approver_1')
  await approver1.set({
    userId: 'approver_1',
    nickName: 'approver_1 san',
    roleRef: rolesRef.doc(Roles.Approver),
  })
  await approver1
    .collection('assistantUserIds')
    .doc('assistant_1')
    .set({
      assistantUserId: 'assistant_1',
      statusRef: statusRef.doc(Status.Register),
    })

  const approver2 = adminDb.collection('users').doc('approver_2')
  await approver2.set({
    userId: 'approver_2',
    nickName: 'approver_2 san',
    roleRef: rolesRef.doc(Roles.Approver),
  })
  await approver2
    .collection('assistantUserIds')
    .doc('assistant_2')
    .set({
      assistantUserId: 'assistant_2',
      statusRef: statusRef.doc(Status.Register),
    })

  const assistant1 = adminDb.collection('users').doc('assistant_1')
  await assistant1.set({
    userId: 'assistant_1',
    nickName: 'assistant_1 san',
    roleRef: rolesRef.doc(Roles.Assistant),
  })

  const assistant2 = adminDb.collection('users').doc('assistant_2')
  await assistant2.set({
    userId: 'assistant_2',
    nickName: 'assistant_2 san',
    roleRef: rolesRef.doc(Roles.Assistant),
  })
}
