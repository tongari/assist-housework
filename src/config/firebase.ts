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

export default initializeFirebase
