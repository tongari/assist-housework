import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'

// eslint-disable-next-line import/prefer-default-export
export const useOnAuthStateChanged = (): {
  isAuthStateChanged: boolean
  isLoggedIn: boolean
} => {
  const [isAuthStateChanged, setIsAuthStateChanged] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)
      }
      setIsAuthStateChanged(true)
    })
  }, [])

  return {
    isAuthStateChanged,
    isLoggedIn,
  }
}
