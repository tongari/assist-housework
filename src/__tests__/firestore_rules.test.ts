import * as firebase from '@firebase/testing'
import * as fs from 'fs'

const PROJECT_ID = 'test-project'
const RULES_PATH = 'firestore.rules'

function authorizedApp(auth?: { uid: string }): firebase.firestore.Firestore {
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore()
}

describe('firestore rules', () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId: PROJECT_ID,
      rules: fs.readFileSync(RULES_PATH, 'utf8'),
    })
  })

  beforeEach(async () => {
    const admin = firebase
      .initializeAdminApp({ projectId: PROJECT_ID })
      .firestore()
    await admin.collection('roles').doc('1').set({
      role: 'admin',
    })
    await admin.collection('roles').doc('2').set({
      role: 'approver',
    })
    await admin.collection('roles').doc('3').set({
      role: 'assistant',
    })

    const rolesRef = admin.collection('roles')
    await admin
      .collection('users')
      .doc('approver_1')
      .set({
        userId: 'approver_1',
        nickName: 'approver_1 san',
        assistantUserIds: ['assistant_1', 'assistant_2'],
        roleRef: rolesRef.doc('2'),
      })
    await admin
      .collection('users')
      .doc('approver_2')
      .set({
        userId: 'approver_2',
        nickName: 'approver_2 san',
        assistantUserIds: ['assistant_11', 'assistant_22'],
        roleRef: rolesRef.doc('2'),
      })
    await admin
      .collection('users')
      .doc('assistant_1')
      .set({
        userId: 'assistant_1',
        nickName: 'assistant_1 san',
        assistantUserIds: [],
        roleRef: rolesRef.doc('3'),
      })
  })

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID })
  })

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()))
  })

  describe('roles collection tests', () => {
    describe('read', () => {
      test('Authorized user can read role', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const rolesRef = db.collection('roles')
        await firebase.assertSucceeds(rolesRef.get())
      })

      test("Unauthorized user can't read role", async () => {
        const db = authorizedApp()
        const rolesRef = db.collection('roles')
        await firebase.assertFails(rolesRef.get())
      })
    })

    describe('write', () => {
      test("can't create role", async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        await firebase.assertFails(
          db.collection('roles').doc('4').set({
            role: 'anonymous',
          })
        )
      })
    })
  })

  describe('users collection tests', () => {
    describe('read', () => {
      test('My account can read', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const approverUser = db.collection('users').doc('approver_1')
        await firebase.assertSucceeds(approverUser.get())
      })

      test('Approval user can read my assistant', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const assistantUser = db.collection('users').doc('assistant_1')
        await firebase.assertSucceeds(assistantUser.get())
      })

      test('Approval user can not read other assistant', async () => {
        const db = authorizedApp({ uid: 'approver_2' })
        const assistantUser = db.collection('users').doc('assistant_1')
        await firebase.assertFails(assistantUser.get())
      })

      test('Assistant user can not read approver', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const approverUser = db.collection('users').doc('approver_1')
        await firebase.assertFails(approverUser.get())
      })

      test('Unauthorized user can not read assistant', async () => {
        const db = authorizedApp()
        const assistantUser = db.collection('users').doc('assistant_1')
        await firebase.assertFails(assistantUser.get())
      })
    })
  })
})
