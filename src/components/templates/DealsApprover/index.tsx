import React from 'react'
import { Now, Deal } from 'types'

// TODO: コンポーネントを適切に分割する

interface Props {
  assistantNickname: string
  now: Now
  deals: Deal[]
  budget: number
  totalPrice: number
  unApprovePrice: number
  approveDealHandler: (dealId: string) => void
}

const DealsApprover: React.FC<Props> = ({
  assistantNickname,
  now,
  deals,
  budget,
  totalPrice,
  unApprovePrice,
  approveDealHandler,
}) => {
  return (
    <div>
      <p>
        {now.year}/{now.month}/{now.date}（{now.day}）
      </p>
      <h1>
        {assistantNickname}さんとの{now.month}月の取引履歴
      </h1>
      <div>
        {deals.map((deal, index) => {
          return (
            <dl key={index.toString()}>
              <dt>
                <p>
                  {deal.year}/{deal.month}/{deal.date}（{deal.day}）
                </p>
              </dt>
              <dd>{deal.itemLabel}</dd>
              <dd>
                {deal.isApproved ? (
                  <p>承認済</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      approveDealHandler(deal.id)
                    }}
                  >
                    承認
                  </button>
                )}
              </dd>
            </dl>
          )
        })}
      </div>
      <p>支払い合計額 : {totalPrice}円</p>
      <p>未承認額 : {unApprovePrice}円</p>
      <p>残りの予算額 : {budget}円</p>
    </div>
  )
}

export default DealsApprover
