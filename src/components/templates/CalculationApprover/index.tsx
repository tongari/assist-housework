import React from 'react'
import { Now } from 'types'

// TODO: コンポーネントを適切に分割する

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
  return (
    <div>
      <p>
        {now.year}/{now.month}/{now.date}（{now.day}）
      </p>
      <h1>
        {assistantNickname}さんに{watchMonth}月のお小遣いを支払いください。
      </h1>
      <p>お小遣い合計額 : {totalPrice}円</p>
      <p>未承認額 : {unApprovePrice}円</p>

      <button
        type="button"
        onClick={() => {
          fixCalculationHandler()
        }}
      >
        {now.month}月を開始する
      </button>
    </div>
  )
}

export default CalculationApprover
