import React from 'react'
import { Now } from 'types'

// TODO: コンポーネントを適切に分割する

interface Props {
  approverNickName: string
  now: Now
  totalPrice: number
  unApprovePrice: number
  watchMonth: string
}

const CalculationAssistant: React.FC<Props> = ({
  approverNickName,
  now,
  totalPrice,
  unApprovePrice,
  watchMonth,
}) => {
  return (
    <div>
      <p>
        {now.year}/{now.month}/{now.date}（{now.day}）
      </p>
      <h1>
        {approverNickName}さんから{watchMonth}月のお小遣いを貰ってくください。
      </h1>
      <p>お小遣い合計額 : {totalPrice}円</p>
      <p>未承認額 : {unApprovePrice}円</p>
    </div>
  )
}

export default CalculationAssistant
