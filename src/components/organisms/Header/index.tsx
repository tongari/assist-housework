import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal'
import indigo from '@material-ui/core/colors/indigo'
import Typography from '@material-ui/core/Typography'

import { Paths, Roles } from 'types'
import { AuthorizedContext } from 'contexts/AuthorizedProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100vw',
      minHeight: '56px',
      padding: theme.spacing(2),
      color: theme.palette.common.white,
      boxShadow: theme.shadows[2],
    },
    text: {
      textAlign: 'center',
      fontWeight: theme.typography.fontWeightMedium,
    },
    day: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.body2.fontSize,
    },
  })
)

const Header: React.FC = () => {
  const classes = useStyles()
  const location = useLocation()
  const { userInfo } = useContext(AuthorizedContext)
  const isApprover = userInfo?.role === Roles.Approver

  const bgTheme = () => {
    if (isApprover || location.pathname === Paths.RegisterApprover) {
      return teal[400]
    }
    return indigo[400]
  }

  const { isAuthorizeContextLoaded, now } = useContext(AuthorizedContext)
  const { year, month, date, day } = now

  const dispDate = isAuthorizeContextLoaded ? `${year}/${month}/${date}` : ''
  const dispDay = isAuthorizeContextLoaded ? `（${day}）` : ''

  return (
    <div className={classes.container} style={{ backgroundColor: bgTheme() }}>
      <Typography className={classes.text}>
        <span>{dispDate}</span>
        <span className={classes.day}>{dispDay}</span>
      </Typography>
    </div>
  )
}

export default Header
