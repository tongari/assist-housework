import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/auth'

import LoginPage from 'pages/LoginPage'
import RegisterApproverPage from 'pages/RegisterApproverPage'

import Auth from 'components/shared/Auth'
import Header from 'components/shared/Header'

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

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Auth>
          <Header />
          <Switch>
            <Route
              exact
              path="/register-approver"
              component={RegisterApproverPage}
            />
            <Route
              path="*"
              render={() => {
                window.location.href = '/404.html'
                return null
              }}
            />
          </Switch>
        </Auth>
      </Switch>
    </Router>
  )
}

export default App
