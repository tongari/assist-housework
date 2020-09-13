import React from 'react'
import { Now, GroupDateDeal } from 'types'

// TODO: コンポーネントを適切に分割する

interface Props {
  approverNickname: string
  now: Now
  groupedDateDeals: GroupDateDeal[]
  budget: number
  totalPrice: number
  unApprovePrice: number
}

const DealsAssistant: React.FC<Props> = ({
  approverNickname,
  now,
  groupedDateDeals,
  budget,
  totalPrice,
  unApprovePrice,
}) => {
  return (
    <div>
      <p>
        {now.year}/{now.month}/{now.date}（{now.day}）
      </p>
      <h1>
        {approverNickname}さんへの{now.month}月のお手伝い履歴
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
                        <span>未承認</span>
                      )}
                    </dd>
                  </React.Fragment>
                )
              })}
            </dl>
          )
        })}
      </div>
      <p>お小遣い合計額 : {totalPrice}円</p>
      <p>未承認額 : {unApprovePrice}円</p>
      <p>残りの予算額 : {budget}円</p>
    </div>
  )
}

export default DealsAssistant
