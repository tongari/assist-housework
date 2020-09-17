import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { Item } from 'types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.common.white,
      borderRadius: '8px',
      boxShadow: theme.shadows[1],
    },
    item: {
      margin: `${theme.spacing(2)}px 0`,
      [theme.breakpoints.down('sm')]: {
        margin: `${theme.spacing(1)}px 0`,
      },
    },
  })
)

interface Props {
  tempItems: Item[]
  updateLabel: (label: string, index: number) => void
  updatePrice: (price: number | null, index: number) => void
}

const SettingItems: React.FC<Props> = ({
  tempItems,
  updateLabel,
  updatePrice,
}) => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h5" component="h2">
        お手伝い項目（最大５つ）
      </Typography>
      <Box m={1.5}>
        {tempItems.map((tempItem, index) => {
          return (
            <Box mt={3}>
              <Grid
                container
                spacing={3}
                key={index.toString()}
                className={classes.container}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="項目"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      placeholder: '20文字以内で設定してください。',
                      maxlength: 20,
                    }}
                    className={classes.item}
                    value={tempItem.label ?? ''}
                    onChange={(e) => {
                      updateLabel(e.target.value, index)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="金額"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      placeholder: '999円まで設定可能です。',
                      maxlength: 3,
                    }}
                    className={classes.item}
                    value={tempItem.price ?? ''}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      if (e.target.value === '') {
                        updatePrice(null, index)
                        return
                      }
                      const price = parseInt(inputValue, 10)
                      if (!Number.isInteger(price)) {
                        return
                      }
                      updatePrice(price, index)
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default SettingItems
