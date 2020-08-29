import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from 'components/organisms/Header'
import { Paths } from 'config/paths'

import LoginPage from 'pages/LoginPage'
import AuthorizedPage from 'pages/AuthorizedPage'
import RegisterApproverPage from 'pages/RegisterApproverPage'
import RegisterAssistantPage from 'pages/RegisterAssistantPage'

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={Paths.Login} component={LoginPage} />
        <AuthorizedPage>
          <Header />
          <Switch>
            <Route
              exact
              path={Paths.RegisterApprover}
              component={RegisterApproverPage}
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
        </AuthorizedPage>
      </Switch>
    </Router>
  )
}

export default App
