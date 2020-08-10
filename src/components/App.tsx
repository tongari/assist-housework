import React from 'react'
import * as firebase from 'firebase/app'
import logo from './logo.svg'
import './App.css'

function App(): React.ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          <code>src/App.tsx</code>
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button
          type="button"
          onClick={() => {
            firebase.auth().signOut()
            window.location.href = '/'
          }}
        >
          logout
        </button>
      </header>
    </div>
  )
}

export default App
