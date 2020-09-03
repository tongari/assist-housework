import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from 'tests/setting'
import { userItemsSeed } from 'tests/firestoreRules/seeds/users/items'

describe('firestore rules users/{userId}/assistToApprovers/{assistToApproverId}/items', () => {
  setup()

  beforeEach(async () => {
    await userItemsSeed()
  })

  describe('read', () => {
    describe('Assistant user', () => {
      test('can read my data ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const item = db
          .collection('users/assistant_1/assistToApprovers/approver_1/items')
          .doc('1')
        await firebase.assertSucceeds(item.get())
      })

      test('can not read other assistToApprovers items ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const item = db
          .collection('users/assistant_2/assistToApprovers/approver_2/items')
          .doc('1')
        await firebase.assertFails(item.get())
      })
    })

    describe('Approval user', () => {
      test('can read items if its user has assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const item = db
          .collection('users/assistant_1/assistToApprovers/approver_1/items')
          .doc('1')
        await firebase.assertSucceeds(item.get())
      })

      test('can not read items if its user does not have assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const item = db
          .collection('users/assistant_1/assistToApprovers/approver_11/items')
          .doc('1')
        await firebase.assertFails(item.get())
      })

      test('can not read items if it is other approver', async () => {
        const db = authorizedApp({ uid: 'approver_2' })
        const item = db
          .collection('users/assistant_1/assistToApprovers/approver_1/items')
          .doc('1')
        await firebase.assertFails(item.get())
      })
    })
  })
})
