import * as firebase from '@firebase/testing'
import { authorizedApp, setup } from '../../setting'
import { userBudgetsSeed } from '../../seeds/users/budgets'

describe('firestore rules users/{userId}/assistToApprovers/{assistToApproverId}/items', () => {
  setup()

  beforeEach(async () => {
    await userBudgetsSeed()
  })

  describe('read', () => {
    describe('Assistant user', () => {
      test('can read my data ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const budget = db
          .collection('users/assistant_1/assistToApprovers/approver_1/budgets')
          .doc('1')
        await firebase.assertSucceeds(budget.get())
      })

      test('can not read other assistToApprovers budgets ', async () => {
        const db = authorizedApp({ uid: 'assistant_1' })
        const budget = db
          .collection('users/assistant_2/assistToApprovers/approver_2/budgets')
          .doc('1')
        await firebase.assertFails(budget.get())
      })
    })

    describe('Approval user', () => {
      test('can read budgets if its user has assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const budget = db
          .collection('users/assistant_1/assistToApprovers/approver_1/items')
          .doc('1')
        await firebase.assertSucceeds(budget.get())
      })

      test('can not read budgets if its user does not have assistant user  ', async () => {
        const db = authorizedApp({ uid: 'approver_1' })
        const budget = db
          .collection('users/assistant_1/assistToApprovers/approver_11/budgets')
          .doc('1')
        await firebase.assertFails(budget.get())
      })

      test('can not read items if it is other approver', async () => {
        const db = authorizedApp({ uid: 'approver_2' })
        const budget = db
          .collection('users/assistant_1/assistToApprovers/approver_1/budgets')
          .doc('1')
        await firebase.assertFails(budget.get())
      })
    })
  })
})
