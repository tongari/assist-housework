import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from 'tests/setting'

describe('firestore rules roles collection', () => {
  setup()

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
    test("Everyone can't create role", async () => {
      const db = authorizedApp({ uid: 'approver_1' })
      await firebase.assertFails(
        db.collection('roles').doc('4').set({
          role: 'anonymous',
        })
      )
    })
  })
})
