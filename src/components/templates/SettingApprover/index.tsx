/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as yup from 'yup'

import { Now, Item, Budget } from 'types'
import { useSharedStyles } from 'styles'
import NextActionText from 'components/molecules/NextActionText'
import SettingItems from 'components/organisms/SettingItems'
import SettingBudget from 'components/organisms/SettingBudget'

interface FormInputs {
  items: Item[]
  budget: Budget
}

interface Props {
  assistantNickname: string
  now: Now
  items: Item[]
  budgets: Budget[]
  calculatedPrice: number
  settingAssistContentsHandler: (editItems: Item[], editBudget: Budget) => void
}

const SettingApprover: React.FC<Props> = ({
  assistantNickname,
  now,
  items,
  budgets,
  calculatedPrice,
  settingAssistContentsHandler,
}) => {
  const classes = useSharedStyles()
  const theme = useTheme()
  const [schemaItems, setSchemaItems] = useState<Item[] | null>(null)

  // TODO: バリデーションロジックを切り出す？
  const itemSchema = yup.object({
    label: yup
      .string()
      .required('入力してください。')
      .max(20, '20文字以内で設定してください。'),

    price: yup
      .number()
      .typeError('半角数字で入力してください。')
      .integer('小数点は入力できません。')
      .positive('1円以上で設定してください。')
      .max(999, '999円まで設定可能です。'),
  })

  const calcMinBudget = () => {
    const checkItems = schemaItems ?? items
    const itemPrices = checkItems?.map((item) => {
      if (item.price) {
        const convertedNumPrice = parseInt(item.price.toString(), 10)
        return Number.isInteger(convertedNumPrice) ? convertedNumPrice : 0
      }
      return 0
    }) ?? [0]

    if (calculatedPrice === 0) {
      return Math.max(1, ...itemPrices)
    }

    return Math.max(calculatedPrice, ...itemPrices)
  }

  const minBudgetErrorText =
    calculatedPrice === 0 ? '' : '取引済みの履歴が存在するので、'

  const budgetSchema = yup.object({
    budget: yup
      .number()
      .typeError('半角数字で入力してください。')
      .integer('小数点は入力できません。')
      .min(
        calcMinBudget(),
        `${minBudgetErrorText}${calcMinBudget()}円以上で設定してください。`
      )
      .max(9999, '9999円まで設定可能です。'),
  })

  const schema = yup.object().shape({
    items: yup
      .array()
      .required('お手伝いの項目を1つ以上、設定してください。')
      .of(itemSchema),

    budget: budgetSchema,
  })

  const methods = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormInputs) => {
    settingAssistContentsHandler(data.items, data.budget)
  }

  return (
    <Box className={classes.templateInner} px={4}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          onChange={() => {
            setSchemaItems(methods.getValues().items)
          }}
        >
          <NextActionText
            words={[
              { text: `${assistantNickname}`, isEmphasis: true },
              { text: 'さんにお願いするお手伝いの内容を入力してください。' },
            ]}
          />
          <SettingItems items={items} setSchemaItems={setSchemaItems} />
          <SettingBudget month={now.month} budget={budgets[0]} />

          <Box m="auto" mb={8} maxWidth={theme.breakpoints.values.sm}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              設定
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}

export default SettingApprover
