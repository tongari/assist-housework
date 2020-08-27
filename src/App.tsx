import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import LoginPage from 'pages/LoginPage'
import RegisterApproverPage from 'pages/RegisterApproverPage'
import PendingRegisterAssistantPage from 'pages/PendingRegisterAssistantPage'
import RegisterAssistantPage from 'pages/RegisterAssistantPage'

import Auth from 'components/shared/Auth'
import Header from 'components/shared/Header'
import { Paths } from 'config/paths'

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={Paths.Login} component={LoginPage} />
        <Auth>
          <Header />
          <Switch>
            <Route
              exact
              path={Paths.RegisterApprover}
              component={RegisterApproverPage}
            />
            <Route
              exact
              path={Paths.PendingRegisterAssistant}
              component={PendingRegisterAssistantPage}
            />
            <Route
              exact
              path={Paths.RegisterAssistant}
              component={RegisterAssistantPage}
            />
            <Route
              path="*"
              render={() => {
                window.location.href = Paths.NotFound
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
