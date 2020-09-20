import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { Budget } from 'types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
      backgroundColor: theme.palette.common.white,
      borderRadius: '4px',
      boxShadow: theme.shadows[1],
      padding: `${theme.spacing(5)}px ${theme.spacing(1.5)}px`,
    },
  })
)

interface Props {
  month: string
  tempBudgets: Budget[]
  updateBudget: (budget: number | null, index: number) => void
}

const SettingBudget: React.FC<Props> = ({
  month,
  tempBudgets,
  updateBudget,
}) => {
  const classes = useStyles()

  return (
    <Box mt={8} mb={4}>
      <Typography variant="h5" component="h2">
        {month}月の予算上限額
      </Typography>
      <div className={classes.container}>
        <TextField
          label="予算額"
          variant="outlined"
          fullWidth
          inputProps={{
            placeholder: '9999円まで設定可能です。',
            maxLength: 4,
          }}
          value={tempBudgets[0]?.budget ?? ''}
          onChange={(e) => {
            const inputValue = e.target.value
            if (e.target.value === '') {
              updateBudget(null, 0)
              return
            }
            const budget = parseInt(inputValue, 10)
            if (!Number.isInteger(budget)) {
              return
            }
            updateBudget(budget, 0)
          }}
        />
      </div>
    </Box>
  )
}

export default SettingBudget
