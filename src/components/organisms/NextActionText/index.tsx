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

interface Word {
  text: string
  isEmphasis?: boolean
}

interface Props {
  words: Word[]
}

const NextActionText: React.FC<Props> = ({ words }) => {
  const classes = useStyles()
  return (
    <Box mt={5} mb={5}>
      <Typography variant="h4" component="h1">
        {words.map((word, index) => {
          if (word.isEmphasis) {
            return (
              <span
                key={index.toString()}
                className={classes.emphasisTitleText}
              >
                {word.text}
              </span>
            )
          }
          return <span key={index.toString()}>{word.text}</span>
        })}
      </Typography>
    </Box>
  )
}

export default NextActionText
