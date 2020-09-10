import React from 'react'
import { Now, GroupDateDeal } from 'types'

// TODO: コンポーネントを適切に分割する

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
  return (
    <div>
      <p>
        {now.year}/{now.month}/{now.date}（{now.day}）
      </p>
      <h1>
        {assistantNickname}さんとの{now.month}月の取引履歴
      </h1>
      <div>
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
                      {deal.isApproved ? (
                        <span>承認済</span>
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
                  </React.Fragment>
                )
              })}
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
