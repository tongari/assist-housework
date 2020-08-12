import React from 'react'
import ReactDOM from 'react-dom'
import initializeFirebase from 'settings/firebase'
import App from './App'
import './index.css'

initializeFirebase()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
