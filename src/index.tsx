import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from 'styles/index'
import initializeFirebase from 'config/firebase'
import RootPage from './pages/RootPage'

initializeFirebase()

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <RootPage />
  </React.StrictMode>,
  document.getElementById('root')
)
