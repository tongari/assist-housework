import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'

import { approverTheme, assistantTheme } from 'styles/index'
import { Paths } from 'types'

import AuthorizedProvider from 'contexts/AuthorizedProvider'
import ContentsProvider from 'contexts/ContentsProvider'
import RunningProvider from 'contexts/RunningProvider'
import CalculationProvider from 'contexts/CalculationProvider'

import Navigation from 'components/organisms/Navigation'
import Header from 'components/organisms/Header'

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
            <Navigation />
            <Switch>
              <Route exact path={Paths.Root} component={RootPage} />

              <Route exact path={Paths.RegisterApprover}>
                <ThemeProvider theme={approverTheme}>
                  <RegisterApproverPage />
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.RegisterAssistant}>
                <ThemeProvider theme={assistantTheme}>
                  <RegisterAssistantPage />
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.ApproveAssistant}>
                <ThemeProvider theme={approverTheme}>
                  <ApproveAssistantPage />
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.SettingApprover}>
                <ThemeProvider theme={approverTheme}>
                  <ContentsProvider>
                    <SettingApproverPage />
                  </ContentsProvider>
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.WorkAssistant}>
                <ThemeProvider theme={assistantTheme}>
                  <ContentsProvider>
                    <RunningProvider>
                      <WorkAssistantPage />
                    </RunningProvider>
                  </ContentsProvider>
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.WorkApprover}>
                <ThemeProvider theme={approverTheme}>
                  <ContentsProvider>
                    <RunningProvider>
                      <WorkApproverPage />
                    </RunningProvider>
                  </ContentsProvider>
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.DealsApprover}>
                <ThemeProvider theme={approverTheme}>
                  <ContentsProvider>
                    <RunningProvider>
                      <DealsApproverPage />
                    </RunningProvider>
                  </ContentsProvider>
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.DealsAssistant}>
                <ThemeProvider theme={assistantTheme}>
                  <ContentsProvider>
                    <RunningProvider>
                      <DealsAssistantPage />
                    </RunningProvider>
                  </ContentsProvider>
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.CalculationAssistant}>
                <ThemeProvider theme={assistantTheme}>
                  <ContentsProvider>
                    <CalculationProvider>
                      <CalculationAssistantPage />
                    </CalculationProvider>
                  </ContentsProvider>
                </ThemeProvider>
              </Route>
              <Route exact path={Paths.CalculationApprover}>
                <ThemeProvider theme={approverTheme}>
                  <ContentsProvider>
                    <CalculationProvider>
                      <CalculationApproverPage />
                    </CalculationProvider>
                  </ContentsProvider>
                </ThemeProvider>
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
