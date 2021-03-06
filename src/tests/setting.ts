import * as firebase from '@firebase/testing'
import * as fs from 'fs'
import { PROJECT_ID, RULES_PATH } from 'tests/config'
import { rolesSeed } from 'tests/firestoreRules/seeds/roles'
import { statusSeed } from 'tests/firestoreRules/seeds/status'
import { usersSeed } from 'tests/firestoreRules/seeds/users'
import { userAssistToApproversSeed } from 'tests/firestoreRules/seeds/users/assistToApprovers'

export const authorizedApp = (auth?: {
  uid: string
}): firebase.firestore.Firestore => {
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore()
}

export const setup = (): void => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId: PROJECT_ID,
      rules: fs.readFileSync(RULES_PATH, 'utf8'),
    })
  })

  beforeEach(async () => {
    await rolesSeed()
    await statusSeed()
    await usersSeed()
    await userAssistToApproversSeed()
  })

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID })
  })

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()))
  })
}
