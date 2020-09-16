import React from 'react'
import Button from '@material-ui/core/Button'

import { Now } from 'types'
import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'
import CalculatedPriceItems from 'components/organisms/CalculatedPriceItems'

interface Props {
  assistantNickname: string
  now: Now
  totalPrice: number
  unApprovePrice: number
  watchMonth: string
  fixCalculationHandler: () => void
}

const CalculationApprover: React.FC<Props> = ({
  assistantNickname,
  now,
  totalPrice,
  unApprovePrice,
  watchMonth,
  fixCalculationHandler,
}) => {
  const classes = useSharedStyles()
  return (
    <>
      <div className={classes.templateInner}>
        <NextActionText nickname={assistantNickname} month={watchMonth}>
          のお小遣いを支払いください。
        </NextActionText>

        <CalculatedPriceItems
          items={[
            { label: 'お小遣い合計額', price: totalPrice },
            { label: '未承認額', price: unApprovePrice },
          ]}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => {
            fixCalculationHandler()
          }}
        >
          {now.month}月を開始する
        </Button>
      </div>
    </>
  )
}

export default CalculationApprover
