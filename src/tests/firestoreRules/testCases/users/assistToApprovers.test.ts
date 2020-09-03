import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from 'tests/setting'

describe('firestore rules users/{userId}/assistToApprovers', () => {
  setup()

  describe('read', () => {
    describe('Assistant user', () => {
      test('can read my assistToApprovers ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const approverUser = db
          .collection('users/assistant_1/assistToApprovers')
          .doc('approver_1')
        await firebase.assertSucceeds(approverUser.get())
      })

      test('can not read other assistToApprovers ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const approverUser = db
          .collection('users/assistant_2/assistToApprovers')
          .doc('approver_2')
        await firebase.assertFails(approverUser.get())
      })
    })

    describe('Approval user', () => {
      test('can read assistToApprovers if its user has assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const approverUser = db
          .collection('users/assistant_1/assistToApprovers')
          .doc('approver_1')
        await firebase.assertSucceeds(approverUser.get())
      })

      test('can not read assistToApprovers if its user does not have assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const approverUser = db
          .collection('users/assistant_1/assistToApprovers')
          .doc('approver_11')
        await firebase.assertFails(approverUser.get())
      })

      test('can not read assistToApprovers if it is other approver', async () => {
        const db = authorizedApp({ uid: 'approver_2' })
        const approverUser = db
          .collection('users/assistant_1/assistToApprovers')
          .doc('approver_1')
        await firebase.assertFails(approverUser.get())
      })
    })
  })
})
