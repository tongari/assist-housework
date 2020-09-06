import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from 'styles/index'
import initializeFirebase from 'config/firebase'
import Routes from 'pages/Routes'

initializeFirebase()

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
)
