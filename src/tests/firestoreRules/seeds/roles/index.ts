import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../../config'

export const rolesSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  await adminDb.collection('roles').doc('1').set({
    role: 'admin',
  })
  await adminDb.collection('roles').doc('2').set({
    role: 'approver',
  })
  await adminDb.collection('roles').doc('3').set({
    role: 'assistant',
  })
}
