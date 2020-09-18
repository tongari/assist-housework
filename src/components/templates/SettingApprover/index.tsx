import React, { useState, useCallback, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import { Now, Item, Budget } from 'types'
import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'
import SettingItems from 'components/organisms/SettingItems'
import SettingBudget from 'components/organisms/SettingBudget'

// TODO: バリデーションをする
// TODO: ロジックを切り出す？

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
  const classes = useSharedStyles()
  const theme = useTheme()

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
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: `${assistantNickname}`, isEmphasis: true },
          { text: 'さんにお願いするお手伝いの内容を入力してください。' },
        ]}
      />
      <SettingItems
        tempItems={tempItems}
        updateLabel={updateLabel}
        updatePrice={updatePrice}
      />
      <SettingBudget
        month={now.month}
        tempBudgets={tempBudgets}
        updateBudget={updateBudget}
      />

      <Box m="auto" mb={8} maxWidth={theme.breakpoints.values.sm}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => {
            settingAssistContentsHandler(tempItems, tempBudgets)
          }}
        >
          設定
        </Button>
      </Box>
    </div>
  )
}

export default SettingApprover
