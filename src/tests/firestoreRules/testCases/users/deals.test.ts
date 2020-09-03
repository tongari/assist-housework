import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from 'tests/setting'
import { userDealsSeed } from 'tests/firestoreRules/seeds/users/deals'

describe('firestore rules users/{userId}/assistToApprovers/{assistToApproverId}/items', () => {
  setup()

  beforeEach(async () => {
    await userDealsSeed()
  })

  describe('read', () => {
    describe('Assistant user', () => {
      test('can read my data ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const deal = db
          .collection('users/assistant_1/assistToApprovers/approver_1/deals')
          .doc('1')
        await firebase.assertSucceeds(deal.get())
      })

      test('can not read other assistToApprovers deals ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const deal = db
          .collection('users/assistant_2/assistToApprovers/approver_2/deals')
          .doc('1')
        await firebase.assertFails(deal.get())
      })
    })

    describe('Approval user', () => {
      test('can read deals if its user has assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const deal = db
          .collection('users/assistant_1/assistToApprovers/approver_1/deals')
          .doc('1')
        await firebase.assertSucceeds(deal.get())
      })

      test('can not read deals if its user does not have assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const deal = db
          .collection('users/assistant_1/assistToApprovers/approver_11/deals')
          .doc('1')
        await firebase.assertFails(deal.get())
      })

      test('can not read deals if it is other approver', async () => {
        const db = authorizedApp({ uid: 'approver_2' })
        const deal = db
          .collection('users/assistant_1/assistToApprovers/approver_1/deals')
          .doc('1')
        await firebase.assertFails(deal.get())
      })
    })
  })
})
