import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from 'tests/setting'

describe('firestore rules users collection', () => {
  setup()

  describe('read', () => {
    describe('Approval user', () => {
      test('can read my data', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const user = db.collection('users').doc('approver_1')
        await firebase.assertSucceeds(user.get())
      })

      test('can read my assistant', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const user = db.collection('users').doc('assistant_1')
        await firebase.assertSucceeds(user.get())
      })

      test('can not read other assistant', async () => {
        const db = authorizedApp({ uid: 'approver_2' })
        const user = db.collection('users').doc('assistant_1')
        await firebase.assertFails(user.get())
      })

      test('can not read other approver', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const user = db.collection('users').doc('approver_2')
        await firebase.assertFails(user.get())
      })
    })

    describe('Assistant user', () => {
      test('can read my data', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const user = db.collection('users').doc('assistant_1')
        await firebase.assertSucceeds(user.get())
      })

      test('can not read other assistant', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const user = db.collection('users').doc('assistant_2')
        await firebase.assertFails(user.get())
      })

      test('can not read approver', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const user = db.collection('users').doc('approver_1')
        await firebase.assertFails(user.get())
      })
    })

    test('Unauthorized user can not read anyone user', async () => {
      const db = authorizedApp()
      const user = db.collection('users').doc('assistant_1')
      await firebase.assertFails(user.get())
    })
  })

  describe('create', () => {
    test('Authorized user can create user document', async () => {
      const db = authorizedApp({ uid: 'approver_999' })
      const rolesRef = db.collection('roles')
      await db
        .collection('users')
        .doc('approver_999')
        .set({
          userId: 'approver_999',
          nickName: 'approver_999 san',
          roleRef: rolesRef.doc('2'),
        })
      const user = db.collection('users').doc('approver_999')
      await firebase.assertSucceeds(user.get())
    })

    test('Other approval user can not create user document', async () => {
      const db = authorizedApp({ uid: 'approver_999' })
      const result = db.collection('users').doc()
      const user = db.collection('users').doc(result.id)
      await firebase.assertFails(user.get())
    })

    test('Assistant user can create user document', async () => {
      const db = authorizedApp({ uid: 'assistant_999' })
      const rolesRef = db.collection('roles')
      await db
        .collection('users')
        .doc('assistant_999')
        .set({
          userId: 'assistant_999',
          nickName: 'assistant_999 san',
          roleRef: rolesRef.doc('3'),
        })
      const user = db.collection('users').doc('assistant_999')
      await firebase.assertSucceeds(user.get())
    })

    test('UnAuthorized user can not create user document', async () => {
      const db = authorizedApp()
      const result = db.collection('users').doc()
      const user = db.collection('users').doc(result.id)
      await firebase.assertFails(user.get())
    })
  })
})
