import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/App'
import './index.css'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_CONFIG_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_CONFIG_APP_ID,
}

firebase.initializeApp(firebaseConfig)

const ui = new firebaseui.auth.AuthUI(firebase.auth())

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: () => false,
    uiShown: () => {
      const loaderEl = document.getElementById('loader')
      if (loaderEl) {
        loaderEl.style.display = 'none'
      }
    },
  },
  signInFlow: 'popup',
  // signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    )
  } else {
    ui.start('#firebaseui-auth-container', uiConfig)
  }
})
