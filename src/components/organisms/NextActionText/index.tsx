import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emphasisTitleText: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.h3.fontSize,
    },
  })
)

interface Props {
  nickname: string
  month: string
}
const NextActionText: React.FC<Props> = ({ nickname, month, children }) => {
  const classes = useStyles()
  return (
    <Box mt={5} mb={5}>
      <Typography variant="h4" component="h1">
        <span className={classes.emphasisTitleText}>{nickname}</span>
        さんに
        <span className={classes.emphasisTitleText}>{month}月分</span>
        {children}
      </Typography>
    </Box>
  )
}

export default NextActionText
