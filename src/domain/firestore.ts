import * as firebase from 'firebase/app'
import { Roles, Status, Item, Budget, Now } from 'types'
import {
  userDocument,
  itemsCollection,
  budgetsCollection,
  dealsCollection,
} from 'config/firebase'

// NOTE: 模索中(firestoreを直接叩く場合は、redux-toolkit必要ないか？)

export const registerApprovalUser = async (
  nickName: string,
  inviteAddress: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const statusRef = db.collection('status')
  const userId = firebase.auth().currentUser?.uid
  await db
    .collection('users')
    .doc(userId)
    .set({
      userId,
      nickName,
      currentWatchUser: {
        statusRef: statusRef.doc(Status.Register),
        inviteAddress,
      },
      roleRef: rolesRef.doc(Roles.Approver),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

  const sendAssistantInviteMail = firebase
    .functions()
    .httpsCallable('sendAssistantInviteMail')

  const result = await sendAssistantInviteMail({ inviteAddress, nickName })
  return result
}

export const registerAssistantUser = async (
  nickName: string,
  assistToApproverId: string | null
): Promise<void> => {
  if (assistToApproverId === null) {
    throw new Error('招待されたメールのURLから登録してください')
  }

  const addAssistantUserIds = firebase
    .functions()
    .httpsCallable('addAssistantUserIds')

  await addAssistantUserIds({ approverId: assistToApproverId }).catch((err) => {
    throw err
  })

  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const statusRef = db.collection('status')
  const userId = firebase.auth().currentUser?.uid

  const userDoc = db.collection('users').doc(userId)
  await userDoc.set({
    userId,
    nickName,
    roleRef: rolesRef.doc(Roles.Assistant),
    currentWatchUser: {
      id: assistToApproverId,
      statusRef: statusRef.doc(Status.Register),
    },
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })
  await userDoc.collection('assistToApprovers').doc(assistToApproverId).set({
    assistToApproverId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })

  const sendApproveAssistantToApprover = firebase
    .functions()
    .httpsCallable('sendApproveAssistantToApprover')

  await sendApproveAssistantToApprover({
    approverId: assistToApproverId,
  }).catch((err) => {
    throw err
  })
}

export const setApprovedAssistant = async (
  assistantId: string
): Promise<void> => {
  const db = firebase.firestore()
  const myId = firebase.auth().currentUser?.uid

  const statusRef = db.collection('status')
  const approver = userDocument(myId)
  await approver.set(
    {
      currentWatchUser: {
        statusRef: statusRef.doc(Status.Setting),
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  )

  const assistant = userDocument(assistantId)
  await assistant.set(
    {
      currentWatchUser: {
        statusRef: statusRef.doc(Status.Setting),
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  )

  const items = itemsCollection(assistantId, myId)

  const range = [...Array(5)] // TODO: マジックナンバー要リファクタ バルクアップデート的なものはできないのか？
  range.forEach(() => {
    items.add({}).then((doc) => {
      doc.set({
        itemId: doc.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    })
  })
}

export const fetchNickName = async (
  userId: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const getNickName = firebase.functions().httpsCallable('getNickName')
  return getNickName({ userId })
}

export const settingAssistContents = async (
  editItems: Item[],
  editBudgets: Budget[],
  now: Now
): Promise<void> => {
  const myId = firebase.auth().currentUser?.uid
  const watchId = (await userDocument().get()).get('currentWatchUser').id

  await new Promise((resolve) => {
    const fn = async () => {
      const items = itemsCollection(watchId, myId)
      const itemsRef = await items.get()
      itemsRef.docs.forEach((doc, index) => {
        const updateItem = editItems.find((editItem) => {
          return editItem.itemId === doc.id
        })
        doc.ref
          .update({
            label: updateItem?.label ?? null,
            price: updateItem?.price ?? null,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            // TODO: 要リファクタ
            // バルクアップデート的なものはできないのか？
            if (index === 4) {
              resolve()
            }
          })
      })
    }
    fn()
  })

  await new Promise((resolve) => {
    const fn = async () => {
      const budgets = budgetsCollection(watchId, myId)
      const searchedBudgets = budgets
        .where('year', '==', now.year)
        .where('month', '==', now.month)

      const budgetsRef = await searchedBudgets.get()

      const updateData = {
        year: now.year,
        month: now.month,
        budget: editBudgets[0]?.budget ?? null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      if (budgetsRef.empty) {
        budgets.add(updateData).then(() => {
          resolve()
        })
      } else {
        budgetsRef.forEach((doc) => {
          doc.ref.update(updateData).then(() => {
            resolve()
          })
        })
      }
    }
    fn()
  })

  const statusRef = firebase.firestore().collection('status')
  const assistant = userDocument(watchId)
  await assistant.set(
    {
      currentWatchUser: {
        statusRef: statusRef.doc(Status.Running),
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  )

  const approver = userDocument()
  await approver.set(
    {
      currentWatchUser: {
        statusRef: statusRef.doc(Status.Running),
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  )
}

export const addDeal = async (now: Now, item: Item): Promise<void> => {
  const myId = firebase.auth().currentUser?.uid
  const approverId = (await userDocument().get()).get('currentWatchUser').id
  const deals = dealsCollection(myId, approverId)

  await deals.add({
    year: now.year,
    month: now.month,
    date: now.date,
    day: now.day,
    itemId: item.itemId,
    itemLabel: item.label,
    price: item.price,
    isApproved: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })
}

export const approveDeal = async (dealId: string): Promise<void> => {
  const myId = firebase.auth().currentUser?.uid
  const assistantId = (await userDocument().get()).get('currentWatchUser').id
  const deals = dealsCollection(assistantId, myId)

  await deals.doc(dealId).update({
    isApproved: true,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })
}

export const updateCalculationState = async (): Promise<void> => {
  const statusRef = firebase.firestore().collection('status')
  const userDoc = userDocument()
  await userDoc.set(
    {
      currentWatchUser: {
        statusRef: statusRef.doc(Status.Calculation),
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  )
}
