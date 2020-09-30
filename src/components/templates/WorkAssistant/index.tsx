import React from 'react'

import { Item } from 'types'
import { useSharedStyles } from 'styles'
import NextActionText from 'components/molecules/NextActionText'
import CalculatedPriceItems from 'components/organisms/CalculatedPriceItems'
import RegisterWorks from 'components/organisms/RegisterWorks'

interface Props {
  approverNickname: string
  items: Item[]
  budget: number
  totalPrice: number
  unApprovePrice: number
  addDealHandler: (item: Item) => void
}

const WorkAssistant: React.FC<Props> = ({
  approverNickname,
  items,
  budget,
  totalPrice,
  unApprovePrice,
  addDealHandler,
}) => {
  const classes = useSharedStyles()
  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: `${approverNickname}`, isEmphasis: true },
          { text: 'さんのお手伝いをしよう！' },
        ]}
      />

      <RegisterWorks items={items} addDealHandler={addDealHandler} />

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

export default WorkAssistant
