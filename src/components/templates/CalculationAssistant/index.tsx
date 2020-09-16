import React from 'react'

import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'
import CalculatedPriceItems from 'components/organisms/CalculatedPriceItems'

interface Props {
  approverNickname: string
  totalPrice: number
  unApprovePrice: number
  watchMonth: string
}

const CalculationAssistant: React.FC<Props> = ({
  approverNickname,
  totalPrice,
  unApprovePrice,
  watchMonth,
}) => {
  const classes = useSharedStyles()
  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: `${approverNickname}`, isEmphasis: true },
          { text: 'さんから' },
          { text: `${watchMonth}月分`, isEmphasis: true },
          { text: 'のお小遣いを貰ってください。' },
        ]}
      />

      <CalculatedPriceItems
        items={[
          { label: 'お小遣い合計額', price: totalPrice },
          { label: '未承認額', price: unApprovePrice },
        ]}
      />
    </div>
  )
}

export default CalculationAssistant
