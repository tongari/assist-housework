import React, { useState, useCallback, useEffect } from 'react'
import { Now, Item, Budget } from 'types'

// TODO: バリデーションをする
// TODO: ロジックを切り出す？
// TODO: コンポーネントを適切に分割する

interface Props {
  assistantNickname: string
  now: Now
  items: Item[]
  budgets: Budget[]
  settingAssistContentsHandler: (
    editItems: Item[],
    editBudget: Budget[]
  ) => void
}

const SettingApprover: React.FC<Props> = ({
  assistantNickname,
  now,
  items,
  settingAssistContentsHandler,
  budgets,
}) => {
  const [tempItems, setTempItems] = useState(items)
  const [tempBudgets, setTempBudgets] = useState(budgets)

  useEffect(() => {
    setTempItems(items)
  }, [items])
  useEffect(() => {
    setTempBudgets(budgets)
  }, [budgets])

  const updateLabel = useCallback(
    (label: string, index: number) => {
      const copy = tempItems.slice()
      copy[index].label = label
      setTempItems(copy)
    },
    [tempItems]
  )

  const updatePrice = useCallback(
    (price: number | null, index: number) => {
      const copy = tempItems.slice()
      copy[index].price = price
      setTempItems(copy)
    },
    [tempItems]
  )

  const updateBudget = useCallback(
    (budget: number | null, index: number) => {
      const copy = tempBudgets.slice()
      if (copy.length === 0) {
        setTempBudgets([
          {
            year: now.year,
            month: now.month,
            budget,
          },
        ])
        return
      }
      copy[index].budget = budget
      setTempBudgets(copy)
    },
    [tempBudgets, now]
  )

  return (
    <div>
      <h1>
        {now.month}月の{assistantNickname}
        さんにお願いするお手伝いの内容を入力してください。
      </h1>
      <form>
        <fieldset>
          <legend>お手伝い項目（最大５つ）</legend>
          <ul>
            {tempItems.map((tempItem, index) => {
              return (
                <li key={index.toString()}>
                  <p>項目:</p>
                  <input
                    type="text"
                    maxLength={20}
                    value={tempItem.label ?? ''}
                    placeholder="20文字以内で設定してください。"
                    onChange={(e) => {
                      updateLabel(e.target.value, index)
                    }}
                  />
                  <p>金額:</p>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="999円まで設定可能です。"
                    value={tempItem.price ?? ''}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      if (e.target.value === '') {
                        updatePrice(null, index)
                        return
                      }
                      const price = parseInt(inputValue, 10)
                      if (!Number.isInteger(price)) {
                        return
                      }
                      updatePrice(price, index)
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </fieldset>
        <fieldset>
          <legend>{now.month}月の予算上限額</legend>
          <input
            type="text"
            maxLength={4}
            placeholder="9999円まで設定可能です。"
            value={tempBudgets[0]?.budget ?? ''}
            onChange={(e) => {
              const inputValue = e.target.value
              if (e.target.value === '') {
                updateBudget(null, 0)
                return
              }
              const budget = parseInt(inputValue, 10)
              if (!Number.isInteger(budget)) {
                return
              }
              updateBudget(budget, 0)
            }}
          />
        </fieldset>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            settingAssistContentsHandler(tempItems, tempBudgets)
          }}
        >
          更新
        </button>
      </form>
    </div>
  )
}

export default SettingApprover
