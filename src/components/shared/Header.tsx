import React from 'react'
import * as firebase from 'firebase/app'

const Header: React.FC = () => {
  return (
    <header>
      <button
        type="button"
        onClick={() => {
          firebase.auth().signOut()
          window.location.href = '/login'
        }}
      >
        logout
      </button>
    </header>
  )
}

export default Header
