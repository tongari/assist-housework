import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from '../../setting'

describe('firestore rules users collection', () => {
  setup()

  describe('read', () => {
    describe('Approval user', () => {
      test('can read my data', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const approverUser = db.collection('users').doc('approver_1')
        await firebase.assertSucceeds(approverUser.get())
      })

      test('can read my assistant', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const assistantUser = db.collection('users').doc('assistant_1')
        await firebase.assertSucceeds(assistantUser.get())
      })

      test('can not read other assistant', async () => {
        const db = authorizedApp({ uid: 'approver_2' })
        const assistantUser = db.collection('users').doc('assistant_1')
        await firebase.assertFails(assistantUser.get())
      })

      test('can not read other approver', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const approverUser = db.collection('users').doc('approver_2')
        await firebase.assertFails(approverUser.get())
      })
    })

    describe('Assistant user', () => {
      test('can read my data', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const approverUser = db.collection('users').doc('assistant_1')
        await firebase.assertSucceeds(approverUser.get())
      })

      test('can not read other assistant', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const approverUser = db.collection('users').doc('assistant_2')
        await firebase.assertFails(approverUser.get())
      })

      test('can not read approver', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const approverUser = db.collection('users').doc('approver_1')
        await firebase.assertFails(approverUser.get())
      })
    })

    test('Unauthorized user can not read anyone user', async () => {
      const db = authorizedApp()
      const assistantUser = db.collection('users').doc('assistant_1')
      await firebase.assertFails(assistantUser.get())
    })
  })
})
