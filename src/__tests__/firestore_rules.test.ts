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

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID })
  })

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()))
  })

  describe('roles collection tests', () => {
    describe('read', () => {
      test('Authorized user can read role', async () => {
        const db = authorizedApp({ uid: 'hoge' })
        const adminRole = db.collection('roles').doc()
        await firebase.assertSucceeds(adminRole.get())
      })

      test("Unauthorized user can't read role", async () => {
        const db = authorizedApp()
        const adminRole = db.collection('roles').doc()
        await firebase.assertSucceeds(adminRole.get())
      })
    })
  })
})
