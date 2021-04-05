import firebase from 'firebase/app'
import { Roles, Status, Item, Budget, Now } from 'types'
import {
  serverTimeDocument,
  userDocument,
  itemsCollection,
  budgetsCollection,
  dealsCollection,
} from 'config/firebase'

// NOTE: 模索中(firestoreを直接叩く場合は、redux-toolkit必要ないか？)

export const registerApprovalUser = async (nickname: string): Promise<void> => {
  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const statusRef = db.collection('status')
  const userId = firebase.auth().currentUser?.uid
  await db
    .collection('users')
    .doc(userId)
    .set({
      userId,
      nickname,
      currentWatchUser: {
        statusRef: statusRef.doc(Status.Register),
      },
      roleRef: rolesRef.doc(Roles.Approver),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}

export const fetchInviteOnetimeUrl = async (
  isUpdate?: boolean
): Promise<firebase.functions.HttpsCallableResult> => {
  const getInviteOnetimeUrl = firebase
    .functions()
    .httpsCallable('getInviteOnetimeUrl')
  return getInviteOnetimeUrl({ isUpdate })
}

export const registerAssistantUser = async (
  nickname: string,
  assistToApproverId: string | null,
  inviteToken: string | null
): Promise<void> => {
  if (assistToApproverId === null || inviteToken === null) {
    throw new Error('招待されたURLから登録してください')
  }

  const addAssistantUserIds = firebase
    .functions()
    .httpsCallable('addAssistantUserIds')

  await addAssistantUserIds({
    approverId: assistToApproverId,
    inviteToken,
  }).catch((err) => {
    throw err
  })

  const db = firebase.firestore()
  const rolesRef = db.collection('roles')
  const statusRef = db.collection('status')
  const userId = firebase.auth().currentUser?.uid

  const userDoc = db.collection('users').doc(userId)
  await userDoc.set({
    userId,
    nickname,
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
}

export const fetchNickname = async (
  userId: string
): Promise<firebase.functions.HttpsCallableResult> => {
  const getNickname = firebase.functions().httpsCallable('getNickname')
  return getNickname({ userId })
}

export const settingAssistContents = async (
  editItems: Item[],
  editBudget: Budget,
  now: Now
): Promise<void> => {
  const myId = firebase.auth().currentUser?.uid
  const watchId = (await userDocument().get()).get('currentWatchUser').id

  const items = itemsCollection(watchId, myId)
  const itemsRef = await items.get()
  editItems.forEach((editItem) => {
    if (!editItem.itemId) {
      items
        .add({
          label: editItem.label,
          price: editItem.price,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((doc) => {
          doc.update({
            itemId: doc.id,
          })
        })
    }
  })
  itemsRef.docs.forEach((doc) => {
    const updateItem = editItems.find((editItem) => {
      return editItem.itemId === doc.id
    })

    if (updateItem) {
      doc.ref.update({
        label: updateItem?.label,
        price: updateItem?.price,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    } else {
      doc.ref.delete()
    }
  })

  const budgets = budgetsCollection(watchId, myId)
  const searchedBudgets = budgets
    .where('year', '==', now.year)
    .where('month', '==', now.month)

  const budgetsRef = await searchedBudgets.get()

  const updateBudget = {
    year: now.year,
    month: now.month,
    budget: editBudget.budget,
  }

  if (budgetsRef.empty) {
    budgets
      .add({
        ...updateBudget,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        doc.update({
          budgetId: doc.id,
        })
      })
  } else {
    budgetsRef.docs.forEach((doc) => {
      doc.ref.update({
        ...updateBudget,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    })
  }

  const statusRef = firebase.firestore().collection('status')
  const serverTime = serverTimeDocument()
  const year = (await serverTime.get()).get('year')
  const month = (await serverTime.get()).get('month')

  const updateCurrentWatchUser = {
    currentWatchUser: {
      statusRef: statusRef.doc(Status.Running),
      year,
      month,
    },
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }

  const assistant = userDocument(watchId)
  await assistant.set(updateCurrentWatchUser, { merge: true })

  const approver = userDocument()
  await approver.set(updateCurrentWatchUser, { merge: true })
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

export const fixCalculation = async (now: Now): Promise<void> => {
  const statusRef = firebase.firestore().collection('status')
  const approver = userDocument()
  const assistantId = (await approver.get()).get('currentWatchUser').id
  const assistant = userDocument(assistantId)

  const updateData = {
    currentWatchUser: {
      statusRef: statusRef.doc(Status.Running),
      year: now.year,
      month: now.month,
    },
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }

  await approver.set(updateData, { merge: true })
  await assistant.set(updateData, { merge: true })
}

export const setCalculationState = async (): Promise<void> => {
  const userDoc = userDocument()
  const serverTime = serverTimeDocument()

  const currentWatchYear = (await userDoc.get()).get('currentWatchUser')?.year
  const currentWatchMonth = (await userDoc.get()).get('currentWatchUser')?.month
  const currentWatchState = (await userDoc.get()).get('currentWatchUser')
    ?.statusRef.id

  const serverTimeYear = (await serverTime.get()).get('year')
  const serverTimeMonth = (await serverTime.get()).get('month')

  if (
    currentWatchState !== Status.Running ||
    (serverTimeYear === currentWatchYear &&
      serverTimeMonth === currentWatchMonth)
  ) {
    return
  }

  const statusRef = firebase.firestore().collection('status')

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
