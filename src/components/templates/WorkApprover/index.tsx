import React from 'react'
import { Now, Deal } from 'types'

// TODO: コンポーネントを適切に分割する

interface Props {
  assistantNickname: string
  now: Now
  deals: Deal[]
  budget: number
  totalPrice: number
  approveDealHandler: (dealId: string) => void
}

const WorkApprover: React.FC<Props> = ({
  assistantNickname,
  now,
  deals,
  budget,
  totalPrice,
  approveDealHandler,
}) => {
  return (
    <div>
      <p>
        {now.year}/{now.month}/{now.date}（{now.day}）
      </p>
      <h1>{assistantNickname}さんのお手伝いを承認してください。</h1>
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
                <button
                  type="button"
                  onClick={() => {
                    approveDealHandler(deal.id)
                  }}
                >
                  承認
                </button>
              </dd>
            </dl>
          )
        })}
      </div>
      <p>支払い合計 : {totalPrice}円</p>
      <p>残りの予算額 : {budget}円</p>
    </div>
  )
}

export default WorkApprover
