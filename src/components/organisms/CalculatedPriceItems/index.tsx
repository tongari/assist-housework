import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
      textAlign: 'center',
    },
    cell: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(3),
      fontSize: theme.typography.body1.fontSize,
    },
  })
)

interface Item {
  label: string
  price: number
}

interface Props {
  items: Item[]
}

const CalculatedPriceItems: React.FC<Props> = ({ items }) => {
  const classes = useStyles()

  return (
    <TableContainer className={classes.container}>
      <Table>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index.toString()}>
              <TableCell component="th" scope="row" className={classes.cell}>
                {item.label}
              </TableCell>
              <TableCell align="right" className={classes.cell}>
                ¥{item.price}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CalculatedPriceItems
