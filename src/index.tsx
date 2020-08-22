import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from 'styles/index'
import initializeFirebase from 'config/firebase'
import App from './App'

initializeFirebase()

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
