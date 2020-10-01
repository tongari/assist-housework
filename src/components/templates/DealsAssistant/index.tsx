import React from 'react'
import { Now, GroupDateDeal } from 'types'
import { useSharedStyles } from 'styles'

import NextActionText from 'components/molecules/NextActionText'
import CalculatedPriceItems from 'components/organisms/CalculatedPriceItems'
import Deals from 'components/organisms/Deals'

interface Props {
  approverNickname: string
  now: Now
  groupedDateDeals: GroupDateDeal[]
  budget: number
  totalPrice: number
  unApprovePrice: number
}

const DealsAssistant: React.FC<Props> = ({
  approverNickname,
  now,
  groupedDateDeals,
  budget,
  totalPrice,
  unApprovePrice,
}) => {
  const classes = useSharedStyles()

  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: `${approverNickname}`, isEmphasis: true },
          { text: 'さんへの' },
          { text: `${now.month}月`, isEmphasis: true },
          { text: 'のお手伝い履歴' },
        ]}
      />

      <Deals groupedDateDeals={groupedDateDeals} isAssistant />

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

export default DealsAssistant
