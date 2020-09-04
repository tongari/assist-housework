import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_CONFIG_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_CONFIG_APP_ID,
}

const initializeFirebase = (): void => {
  firebase.initializeApp(firebaseConfig)
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_USE_EMULATORS === 'on'
  ) {
    const db = firebase.firestore()
    const functions = firebase.functions()

    db.settings({
      host: 'localhost:8080',
      ssl: false,
    })
    functions.useFunctionsEmulator('http://localhost:5001')
  }
}

export const myUserDocument = (): firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
> => firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`)

export const otherUserDocument = (
  uid: string
): firebase.firestore.DocumentReference<firebase.firestore.DocumentData> =>
  firebase.firestore().doc(`users/${uid}`)

export const assistantUserIdsCollection = (): firebase.firestore.CollectionReference<
  firebase.firestore.DocumentData
> =>
  firebase
    .firestore()
    .collection(`users/${firebase.auth().currentUser?.uid}/assistantUserIds`)

export const assistToApproversCollection = (): firebase.firestore.CollectionReference<
  firebase.firestore.DocumentData
> =>
  firebase
    .firestore()
    .collection(`users/${firebase.auth().currentUser?.uid}/assistToApprovers`)

export default initializeFirebase
