import React from 'react'
import { Now, GroupDateDeal } from 'types'

// TODO: コンポーネントを適切に分割する

interface Props {
  assistantNickname: string
  now: Now
  groupedDateDeals: GroupDateDeal[]
  budget: number
  totalPrice: number
  approveDealHandler: (dealId: string) => void
}

const WorkApprover: React.FC<Props> = ({
  assistantNickname,
  now,
  groupedDateDeals,
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
        {groupedDateDeals.length === 0 && (
          <p>本日はまだ、{assistantNickname}さんはお手伝いをしていません。</p>
        )}
        {groupedDateDeals.map((groupedDateDeal, index) => {
          return (
            <dl key={index.toString()}>
              <dt>
                {now.year}/{now.month}/{groupedDateDeal.date}（
                {groupedDateDeal.day}）
              </dt>
              {groupedDateDeal.deals.map((deal) => {
                return (
                  <React.Fragment key={deal.id}>
                    <dd>
                      <span>{deal.itemLabel}</span>
                      <button
                        type="button"
                        onClick={() => {
                          approveDealHandler(deal.id)
                        }}
                      >
                        承認
                      </button>
                    </dd>
                  </React.Fragment>
                )
              })}
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
