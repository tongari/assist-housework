import React, { useState, useCallback, useContext } from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import AddIcon from '@material-ui/icons/Add'
import HistoryIcon from '@material-ui/icons/History'
import SettingsIcon from '@material-ui/icons/Settings'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import { AuthorizedContext } from 'contexts/AuthorizedProvider'
import OtherDrawer from 'components/organisms/OtherDrawer'
import { Status } from 'types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      bottom: 0,
      width: '100vw',
      backgroundColor: theme.palette.primary.light,
      boxShadow: theme.shadows[24],
      '& *': {
        color: theme.palette.common.white,
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
  })
)

type NavigationValue = 'work' | 'deals' | 'setting'

const Navigation: React.FC = () => {
  const classes = useStyles()
  const { userInfo } = useContext(AuthorizedContext)

  const [navigationValue, setNavigationValue] = useState<NavigationValue>(
    'work'
  )
  const [isOpenedDrawer, setIsOpenedDrawer] = useState(false)

  const changeNavigationHandler = (
    _: React.ChangeEvent<Record<string, NavigationValue>>,
    newValue: NavigationValue
  ) => {
    setNavigationValue(newValue)
  }

  const closeDrawer = useCallback(() => {
    setIsOpenedDrawer(false)
  }, [])

  const CustomBottomNavigation: React.FC = ({ children }) => (
    <BottomNavigation
      value={navigationValue}
      onChange={changeNavigationHandler}
      showLabels
      className={classes.root}
    >
      {children}
    </BottomNavigation>
  )

  return (
    <>
      {userInfo?.state === Status.Running ? (
        <CustomBottomNavigation>
          <BottomNavigationAction
            label="取引登録"
            value="work"
            icon={<AddIcon />}
          />
          <BottomNavigationAction
            label="取引履歴"
            value="deals"
            icon={<HistoryIcon />}
          />
          <BottomNavigationAction
            label="取引設定"
            value="setting"
            icon={<SettingsIcon />}
          />
          <BottomNavigationAction
            label="その他"
            value="none"
            icon={<MoreHorizIcon />}
            onClick={(e) => {
              e.preventDefault()
              setIsOpenedDrawer(true)
            }}
          />
        </CustomBottomNavigation>
      ) : (
        <CustomBottomNavigation>
          <BottomNavigationAction
            label="その他"
            value="none"
            icon={<MoreHorizIcon />}
            onClick={(e) => {
              e.preventDefault()
              setIsOpenedDrawer(true)
            }}
          />
        </CustomBottomNavigation>
      )}

      <OtherDrawer isOpen={isOpenedDrawer} closeDrawer={closeDrawer} />
    </>
  )
}

export default Navigation
