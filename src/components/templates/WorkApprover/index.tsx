import React from 'react'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import InfoIcon from '@material-ui/icons/Info'

import { Now, GroupDateDeal } from 'types'
import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'
import CalculatedPriceItems from 'components/organisms/CalculatedPriceItems'
import Deals from 'components/organisms/Deals'

interface Props {
  assistantNickname: string
  now: Now
  groupedDateDeals: GroupDateDeal[]
  budget: number
  totalPrice: number
  unApprovePrice: number
  approveDealHandler: (dealId: string) => void
}

const WorkApprover: React.FC<Props> = ({
  assistantNickname,
  groupedDateDeals,
  budget,
  totalPrice,
  unApprovePrice,
  approveDealHandler,
}) => {
  const classes = useSharedStyles()

  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: `${assistantNickname}`, isEmphasis: true },
          { text: 'さんのお手伝いを承認してください。' },
        ]}
      />

      {groupedDateDeals.length === 0 ? (
        <Box display="flex">
          <InfoIcon color="secondary" />
          <Typography>
            本日はまだ、
            {assistantNickname}さんはお手伝いをしていません。
          </Typography>
        </Box>
      ) : (
        <Deals
          groupedDateDeals={groupedDateDeals}
          approveDealHandler={approveDealHandler}
        />
      )}

      <CalculatedPriceItems
        items={[
          { label: '支払い合計', price: totalPrice },
          { label: '未承認額', price: unApprovePrice },
          { label: '残りの予算額', price: budget },
        ]}
      />
    </div>
  )
}

export default WorkApprover
