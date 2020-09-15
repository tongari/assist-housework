import React from 'react'

import { Now } from 'types'
import { useSharedStyles } from 'styles'
import DateText from 'components/molecules/DateText'
import NextActionText from 'components/organisms/NextActionText'
import CalculatedPriceItems from 'components/organisms/CalculatedPriceItems'

interface Props {
  approverNickname: string
  now: Now
  totalPrice: number
  unApprovePrice: number
  watchMonth: string
}

const CalculationAssistant: React.FC<Props> = ({
  approverNickname,
  now,
  totalPrice,
  unApprovePrice,
  watchMonth,
}) => {
  const classes = useSharedStyles()
  return (
    <>
      <DateText now={now} />
      <div className={classes.templateInner}>
        <NextActionText nickname={approverNickname} month={watchMonth}>
          のお小遣いを貰ってください。
        </NextActionText>

        <CalculatedPriceItems
          items={[
            { label: 'お小遣い合計額', price: totalPrice },
            { label: '未承認額', price: unApprovePrice },
          ]}
        />
      </div>
    </>
  )
}

export default CalculationAssistant
