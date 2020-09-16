import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import { GroupDateDeal } from 'types'

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
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      fontSize: theme.typography.body2.fontSize,
      height: theme.spacing(6),
    },
  })
)

interface Props {
  groupedDateDeals: GroupDateDeal[]
  approveDealHandler?: (dealId: string) => void
  isAssistant?: boolean
}

const Deals: React.FC<Props> = ({
  groupedDateDeals,
  approveDealHandler,
  isAssistant,
}) => {
  const classes = useStyles()

  const renderUnApproval = (dealId: string) => {
    if (isAssistant) {
      return (
        <Typography color="secondary" variant="body2">
          未承認
        </Typography>
      )
    }
    return (
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={() => {
          if (approveDealHandler) {
            approveDealHandler(dealId)
          }
        }}
      >
        承認
      </Button>
    )
  }

  return (
    <TableContainer className={classes.container}>
      {groupedDateDeals.map((groupedDateDeal, index) => (
        <React.Fragment key={index.toString()}>
          <Box m={1}>
            <Typography variant="h6" component="p" align="left">
              {`${groupedDateDeal.month}/${groupedDateDeal.date}（${groupedDateDeal.day}）`}
            </Typography>
          </Box>
          <Table key={index.toString()}>
            <TableBody>
              {groupedDateDeal.deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.cell}
                  >
                    {deal.itemLabel}（¥{deal.price}）
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    {deal.isApproved ? (
                      <Typography color="textSecondary" variant="body2">
                        承認済
                      </Typography>
                    ) : (
                      <>{renderUnApproval(deal.id)}</>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      ))}
    </TableContainer>
  )
}

export default Deals
