import React from 'react'
import { Now, Item } from 'types'

// TODO: コンポーネントを適切に分割する

interface Props {
  approverNickName: string
  now: Now
  items: Item[]
  budget: number
  totalPrice: number
}

const WorkAssistant: React.FC<Props> = ({
  approverNickName,
  now,
  items,
  budget,
  totalPrice,
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
              <button type="button">{item.label}</button>
            </li>
          )
        })}
      </ul>
      <p>これまでのお小遣い合計 : {totalPrice}円</p>
      <p>残りの予算額 : {budget}円</p>
    </div>
  )
}

export default WorkAssistant
