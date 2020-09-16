import React, { useContext } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { AuthorizedContext } from 'contexts/AuthorizedProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100vw',
      minHeight: '56px',
      padding: theme.spacing(2),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.light,
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

  const { isAuthorizeContextLoaded, now } = useContext(AuthorizedContext)
  const { year, month, date, day } = now

  const dispDate = isAuthorizeContextLoaded ? `${year}/${month}/${date}` : ''
  const dispDay = isAuthorizeContextLoaded ? `（${day}）` : ''

  return (
    <div className={classes.container}>
      <Typography className={classes.text}>
        <span>{dispDate}</span>
        <span className={classes.day}>{dispDay}</span>
      </Typography>
    </div>
  )
}

export default Header
