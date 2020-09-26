import React, { useCallback, useEffect } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'

import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'

import { Item } from 'types'

const MAX_ITEMS = 5

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
  setSchemaItems: (params: Item[]) => void
}

const SettingItems: React.FC<Props> = ({ items, setSchemaItems }) => {
  const classes = useStyles()
  const theme = useTheme()

  const { register, errors, control, setValue, trigger } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  useEffect(() => {
    setValue('items', items)
  }, [setValue, items])

  const onAddItem = useCallback(() => {
    append({ label: null, price: null })
  }, [append])

  const onRemoveItem = useCallback(
    (index: number) => {
      remove(index)
    },
    [remove]
  )

  useEffect(() => {
    setSchemaItems(fields as Item[])
  }, [fields, setSchemaItems])

  return (
    <>
      <Typography variant="h5" component="h2">
        {`お手伝い項目（最大${MAX_ITEMS}つ）`}
      </Typography>
      {errors?.items && <p>{errors.items.message}</p>}
      <Box m={1.5}>
        {fields.map((field, index) => {
          return (
            <Box mt={5} position="relative" key={index.toString()}>
              <Grid
                container
                spacing={3}
                key={index.toString()}
                className={classes.container}
              >
                <Grid item xs={12} sm={6}>
                  <TextField
                    key={field.id}
                    name={`items[${index.toString()}].label`}
                    label="項目"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      placeholder: '20文字以内で設定してください。',
                      autoCorrect: 'off',
                      autoCapitalize: 'off',
                      autoComplete: 'off',
                    }}
                    className={classes.item}
                    defaultValue={field.label ?? ''}
                    inputRef={register()}
                    onBlur={() => {
                      trigger('items')
                      trigger('budget')
                    }}
                  />
                  {errors?.items && (
                    <p>{errors.items[index]?.label?.message}</p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    key={field.id}
                    name={`items[${index.toString()}].price`}
                    label="金額"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      placeholder: '999円まで設定可能です。',
                      autoCorrect: 'off',
                      autoCapitalize: 'off',
                      autoComplete: 'off',
                    }}
                    className={classes.item}
                    defaultValue={field.price ?? ''}
                    inputRef={register()}
                    onBlur={() => {
                      trigger('items')
                      trigger('budget')
                    }}
                  />
                  {errors?.items && (
                    <p>{errors.items[index]?.price?.message}</p>
                  )}
                </Grid>
              </Grid>
              <Box
                position="absolute"
                top={-1 * theme.spacing(4)}
                right={-1 * theme.spacing(5)}
              >
                {fields.length > 1 && (
                  <IconButton
                    color="default"
                    onClick={() => {
                      onRemoveItem(index)
                    }}
                  >
                    <RemoveCircleIcon fontSize="large" />
                  </IconButton>
                )}
              </Box>
              <input
                type="hidden"
                key={field.id}
                name={`items[${index.toString()}].itemId`}
                defaultValue={field.itemId}
                ref={register()}
              />
            </Box>
          )
        })}
      </Box>

      <Box textAlign="center">
        <IconButton
          color="primary"
          disabled={fields.length === MAX_ITEMS}
          onClick={() => {
            onAddItem()
          }}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Box>
    </>
  )
}

export default SettingItems
