import React from 'react'
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

const DealsApprover: React.FC<Props> = ({
  assistantNickname,
  now,
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
          { text: 'さんとの' },
          { text: `${now.month}月`, isEmphasis: true },
          { text: 'の取引履歴' },
        ]}
      />

      <Deals
        groupedDateDeals={groupedDateDeals}
        approveDealHandler={approveDealHandler}
      />

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

export default DealsApprover
