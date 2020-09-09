import React from 'react'
import { Now, Item } from 'types'

// TODO: コンポーネントを適切に分割する

interface Props {
  approverNickName: string
  now: Now
  items: Item[]
  budget: number
  totalPrice: number
  addDealHandler: (item: Item) => void
}

const WorkAssistant: React.FC<Props> = ({
  approverNickName,
  now,
  items,
  budget,
  totalPrice,
  addDealHandler,
}) => {
  return (
    <div>
      <p>
        {now.year}/{now.month}/{now.date}（{now.day}）
      </p>
      <h1>{approverNickName}さんのお手伝いをしよう！</h1>
      <ul>
        {items.map((item, index) => {
          return (
            <li key={index.toString()}>
              <button
                type="button"
                disabled={item.isWorked}
                onClick={() => {
                  addDealHandler(item)
                }}
              >
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
      <p>お小遣い予定額 : {totalPrice}円</p>
      <p>残りの予算額 : {budget}円</p>
    </div>
  )
}

export default WorkAssistant
