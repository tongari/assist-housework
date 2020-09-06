import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from 'components/organisms/Header'
import { Paths } from 'types'

import AuthorizedProvider from 'contexts/AuthorizedProvider'
import ContentsProvider from 'contexts/ContentsProvider'

import Authorized from 'pages/Authorized'
import RootPage from 'pages/RootPage'
import LoginPage from 'pages/LoginPage'
import RegisterApproverPage from 'pages/RegisterApproverPage'
import RegisterAssistantPage from 'pages/RegisterAssistantPage'
import ApproveAssistantPage from 'pages/ApproveAssistantPage'
import SettingApproverPage from 'pages/SettingApproverPage'

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={Paths.Login} component={LoginPage} />
        <AuthorizedProvider>
          <Authorized>
            <Header />
            <Switch>
              <Route exact path="/" component={RootPage} />
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
              <ContentsProvider>
                <Route
                  exact
                  path={Paths.SettingApprover}
                  component={SettingApproverPage}
                />
              </ContentsProvider>
              <Route
                path="*"
                render={() => {
                  window.location.href = Paths.NotFound
                  return null
                }}
              />
            </Switch>
          </Authorized>
        </AuthorizedProvider>
      </Switch>
    </Router>
  )
}

export default App
