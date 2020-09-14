import React from 'react'
import ReactDOM from 'react-dom'
import { globalTheme } from 'styles/index'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'

import initializeFirebase from 'config/firebase'
import Routes from 'pages/Routes'

initializeFirebase()

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
