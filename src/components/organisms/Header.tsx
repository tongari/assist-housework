import React from 'react'
import * as firebase from 'firebase/app'
import { Paths } from 'types'

const Header: React.FC = () => {
  return (
    <header>
      <button
        type="button"
        onClick={() => {
          firebase.auth().signOut()
          window.location.href = Paths.Login
        }}
      >
        logout
      </button>
    </header>
  )
}

export default Header
