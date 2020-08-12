import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import LoginPage from 'pages/LoginPage'
import RegisterApproverPage from 'pages/RegisterApproverPage'

import Auth from 'components/shared/Auth'
import Header from 'components/shared/Header'

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
