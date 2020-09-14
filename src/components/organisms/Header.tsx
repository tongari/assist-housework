import React from 'react'
import * as firebase from 'firebase/app'
import Button from '@material-ui/core/Button'
import { Paths } from 'types'

const Header: React.FC = () => {
  return (
    <header>
      <Button
        variant="contained"
        color="default"
        onClick={() => {
          firebase.auth().signOut()
          window.location.href = Paths.Login
        }}
      >
        ログアウト
      </Button>
    </header>
  )
}

export default Header
