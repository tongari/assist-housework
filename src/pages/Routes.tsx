import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from 'components/organisms/Header'
import { Paths } from 'types'

import AuthorizedProvider from 'contexts/AuthorizedProvider'
import ContentsProvider from 'contexts/ContentsProvider'
import CalculationProvider from 'contexts/CalculationProvider'

import Authorized from 'pages/Authorized'
import RootPage from 'pages/RootPage'
import LoginPage from 'pages/LoginPage'
import RegisterApproverPage from 'pages/RegisterApproverPage'
import RegisterAssistantPage from 'pages/RegisterAssistantPage'
import ApproveAssistantPage from 'pages/ApproveAssistantPage'
import SettingApproverPage from 'pages/SettingApproverPage'
import WorkAssistantPage from 'pages/WorkAssistantPage'
import WorkApproverPage from 'pages/WorkApproverPage'
import DealsApproverPage from 'pages/DealsApproverPage'
import DealsAssistantPage from 'pages/DealsAssistantPage'
import CalculationAssistantPage from 'pages/CalculationAssistantPage'
import CalculationApproverPage from 'pages/CalculationApproverPage'

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={Paths.Login} component={LoginPage} />
        <AuthorizedProvider>
          <Authorized>
            <Header />
            <Switch>
              <Route exact path={Paths.Root} component={RootPage} />
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
              <Route exact path={Paths.SettingApprover}>
                <ContentsProvider>
                  <SettingApproverPage />
                </ContentsProvider>
              </Route>
              <Route exact path={Paths.WorkAssistant}>
                <ContentsProvider>
                  <WorkAssistantPage />
                </ContentsProvider>
              </Route>
              <Route exact path={Paths.WorkApprover}>
                <ContentsProvider>
                  <WorkApproverPage />
                </ContentsProvider>
              </Route>
              <Route exact path={Paths.DealsApprover}>
                <ContentsProvider>
                  <DealsApproverPage />
                </ContentsProvider>
              </Route>
              <Route exact path={Paths.DealsAssistant}>
                <ContentsProvider>
                  <DealsAssistantPage />
                </ContentsProvider>
              </Route>
              <Route exact path={Paths.CalculationAssistant}>
                <ContentsProvider>
                  <CalculationProvider>
                    <CalculationAssistantPage />
                  </CalculationProvider>
                </ContentsProvider>
              </Route>
              <Route exact path={Paths.CalculationApprover}>
                <ContentsProvider>
                  <CalculationProvider>
                    <CalculationApproverPage />
                  </CalculationProvider>
                </ContentsProvider>
              </Route>
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
