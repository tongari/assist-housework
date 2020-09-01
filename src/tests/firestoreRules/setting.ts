import * as firebase from '@firebase/testing'
import * as fs from 'fs'
import { PROJECT_ID, RULES_PATH } from './config'
import { rolesSeed } from './seeds/roles'
import { statusSeed } from './seeds/status'
import { usersSeed } from './seeds/users'
import { userAssistToApproversSeed } from './seeds/users/assistToApprovers'

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
