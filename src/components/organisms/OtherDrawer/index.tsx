import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'

import { useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import { Paths } from 'types'

interface Props {
  isOpen: boolean
  closeDrawer: () => void
}

const OtherDrawer: React.FC<Props> = ({ isOpen, closeDrawer }) => {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    setOpened(isOpen)
  }, [isOpen])

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    closeDrawer()
  }

  return (
    <Drawer anchor="right" open={opened} onClose={toggleDrawer}>
      <Box p={5} bgcolor={theme.palette.grey[200]} height="100vh">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            firebase.auth().signOut()
            window.location.href = Paths.Root
          }}
        >
          ログアウト
        </Button>
      </Box>
    </Drawer>
  )
}
export default OtherDrawer
