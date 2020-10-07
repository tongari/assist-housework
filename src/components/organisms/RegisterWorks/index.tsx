import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { Item } from 'types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: 0,
    },
    item: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
      maxWidth: theme.breakpoints.values.sm,
      margin: 'auto',
    },
  })
)

interface Props {
  items: Item[]
  budget: number
  addDealHandler: (item: Item) => void
}

const RegisterWorks: React.FC<Props> = ({ items, budget, addDealHandler }) => {
  const classes = useStyles()

  return (
    <ul className={classes.container}>
      {items.map((item, index) => {
        return (
          <li key={index.toString()} className={classes.item}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={item.isWorked || budget < (item.price ?? 0)}
              onClick={() => {
                addDealHandler(item)
              }}
            >
              {`${item.label}(¥${item.price})`}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export default RegisterWorks
