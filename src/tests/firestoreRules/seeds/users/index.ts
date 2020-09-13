import * as firebase from '@firebase/testing'
import { PROJECT_ID } from 'tests/config'
import { Roles } from 'types'

export const usersSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  const rolesRef = adminDb.collection('roles')

  const approver1 = adminDb.collection('users').doc('approver_1')
  await approver1.set({
    userId: 'approver_1',
    nickname: 'approver_1 san',
    roleRef: rolesRef.doc(Roles.Approver),
    assistantUserIds: ['assistant_1'],
  })

  const approver2 = adminDb.collection('users').doc('approver_2')
  await approver2.set({
    userId: 'approver_2',
    nickname: 'approver_2 san',
    roleRef: rolesRef.doc(Roles.Approver),
    assistantUserIds: ['assistant_2'],
  })

  const assistant1 = adminDb.collection('users').doc('assistant_1')
  await assistant1.set({
    userId: 'assistant_1',
    nickname: 'assistant_1 san',
    roleRef: rolesRef.doc(Roles.Assistant),
  })

  const assistant2 = adminDb.collection('users').doc('assistant_2')
  await assistant2.set({
    userId: 'assistant_2',
    nickname: 'assistant_2 san',
    roleRef: rolesRef.doc(Roles.Assistant),
  })
}
