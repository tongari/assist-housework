import React, { useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'

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
      borderRadius: '4px',
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
  items: Item[]
}

const SettingItems: React.FC<Props> = ({ items }) => {
  const classes = useStyles()

  const { register, errors, control } = useFormContext()
  const { fields, append } = useFieldArray({
    control,
    name: 'items',
  })

  useEffect(() => {
    if (items.length === 0 && fields.length === 0) {
      append({ label: null, price: null })
      return
    }
    items.forEach((item) => {
      const sameId = fields.findIndex((fieldItem) => {
        return fieldItem.itemId === item.itemId
      })
      if (sameId === -1) {
        append({ label: item.label, price: item.price, itemId: item.itemId })
      }
    })
  }, [items, fields, append])

  return (
    <>
      <Typography variant="h5" component="h2">
        お手伝い項目（最大５つ）
      </Typography>
      <Box m={1.5}>
        {fields.map((field, index) => {
          return (
            <Box mt={3} key={index.toString()}>
              <Grid
                container
                spacing={3}
                key={index.toString()}
                className={classes.container}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    name={`items[${index.toString()}].label`}
                    label="項目"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      placeholder: '20文字以内で設定してください。',
                    }}
                    className={classes.item}
                    defaultValue={field.label ?? ''}
                    inputRef={register()}
                  />
                  {errors?.items && (
                    <p>{errors.items[index]?.label?.message}</p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name={`items[${index.toString()}].price`}
                    label="金額"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      placeholder: '999円まで設定可能です。',
                    }}
                    className={classes.item}
                    defaultValue={field.price ?? ''}
                    inputRef={register()}
                  />
                  {errors?.items && (
                    <p>{errors.items[index]?.price?.message}</p>
                  )}
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
