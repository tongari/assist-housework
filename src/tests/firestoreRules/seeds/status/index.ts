import * as firebase from '@firebase/testing'
import { PROJECT_ID } from '../../config'

export const statusSeed = async (): Promise<void> => {
  const adminDb = firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore()

  await adminDb.collection('status').doc('1').set({
    state: 'register',
  })
  await adminDb.collection('status').doc('2').set({
    state: 'setting',
  })
  await adminDb.collection('status').doc('3').set({
    state: 'running',
  })
  await adminDb.collection('status').doc('4').set({
    state: 'calculation',
  })
}
