import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from 'tests/setting'

describe('firestore rules status collection', () => {
  setup()

  describe('read', () => {
    test('Authorized user can read status', async () => {
      const db = authorizedApp({ uid: 'approver_1' })
      const statusRef = db.collection('status')
      await firebase.assertSucceeds(statusRef.get())
    })

    test("Unauthorized user can't read status", async () => {
      const db = authorizedApp()
      const statusRef = db.collection('status')
      await firebase.assertFails(statusRef.get())
    })
  })

  describe('write', () => {
    test("Everyone can't create status", async () => {
      const db = authorizedApp({ uid: 'approver_1' })
      await firebase.assertFails(
        db.collection('status').doc('99').set({
          state: 'anonymous',
        })
      )
    })
  })
})
