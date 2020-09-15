import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Now } from 'types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100vw',
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

interface Props {
  now: Now
}

const DateText: React.FC<Props> = ({ now }) => {
  const classes = useStyles()
  const { year, month, date, day } = now
  return (
    <div className={classes.container}>
      <Typography className={classes.text}>
        <span>
          {year}/{month}/{date}
        </span>
        <span className={classes.day}>（{day}）</span>
      </Typography>
    </div>
  )
}

export default DateText
