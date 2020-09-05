import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from 'components/organisms/Header'
import { Paths } from 'types'

import LoginPage from 'pages/LoginPage'
import AuthorizedPage from 'pages/AuthorizedPage'
import RegisterApproverPage from 'pages/RegisterApproverPage'
import RegisterAssistantPage from 'pages/RegisterAssistantPage'
import ApproveAssistantPage from 'pages/ApproveAssistantPage'
import SettingApproverPage from './SettingApproverPage'

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
              exact
              path={Paths.ApproveAssistant}
              component={ApproveAssistantPage}
            />
            <Route
              exact
              path={Paths.SettingApprover}
              component={SettingApproverPage}
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
