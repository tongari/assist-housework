import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { useFormContext } from 'react-hook-form'

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
  budget: Budget
}

const SettingBudget: React.FC<Props> = ({ month, budget }) => {
  const classes = useStyles()
  const { register, errors } = useFormContext()

  return (
    <Box mt={8} mb={4}>
      <Typography variant="h5" component="h2">
        {month}月の予算上限額
      </Typography>
      <div className={classes.container}>
        <TextField
          name="budget.budget"
          label="予算額"
          variant="outlined"
          fullWidth
          inputProps={{
            placeholder: '9999円まで設定可能です。',
            autoCorrect: 'off',
            autoCapitalize: 'off',
            autoComplete: 'off',
          }}
          defaultValue={budget?.budget ?? ''}
          inputRef={register()}
        />
        <p>{errors?.budget?.budget?.message}</p>
      </div>
    </Box>
  )
}

export default SettingBudget
