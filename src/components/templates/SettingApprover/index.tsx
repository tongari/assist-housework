/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as yup from 'yup'

import { Now, Item, Budget } from 'types'
import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'
import SettingItems from 'components/organisms/SettingItems'
import SettingBudget from 'components/organisms/SettingBudget'

// TODO: バリデーションをする
// TODO: ロジックを切り出す？
const itemSchema = yup.object({
  label: yup
    .string()
    .max(5, '文字数超えてます。')
    .required('入力してください。'),
  // TODO: 後で削除する
  // eslint-disable-next-line func-names
  // .test('Both price', '必須です', function (value) {
  //   if (this.parent.price === null && value === '') {
  //     return true
  //   }
  //   if (this.parent.price !== null && value === '') {
  //     return false
  //   }
  //   return true
  // }),
  price: yup
    .number()
    .transform((v, o) => (o === '' ? null : v))
    .typeError('半角数字で入力してください。')
    .nullable()
    .integer('小数点は入力できません。')
    .positive('1円以上で設定してください。')
    .max(999, '999円まで設定可能です。')
    .required('入力してください。'),
  // eslint-disable-next-line func-names
  // .test('Both label', '必須です', function (value) {
  //   if (this.parent.label === '' && value === null) {
  //     return true
  //   }
  //   if (this.parent.label !== '' && value === null) {
  //     return false
  //   }
  //   return true
  // }),
})

const schema = yup.object().shape({
  items: yup.array().of(itemSchema),
})

interface FormInputs {
  items: Item[]
}

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
  // settingAssistContentsHandler,
  budgets,
}) => {
  const classes = useSharedStyles()
  const theme = useTheme()

  const [tempBudgets, setTempBudgets] = useState(budgets)

  const methods = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (data: FormInputs) => {
    // settingAssistContentsHandler(data.items, data.editBudget)
  }

  useEffect(() => {
    setTempBudgets(budgets)
  }, [budgets])

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
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <NextActionText
            words={[
              { text: `${assistantNickname}`, isEmphasis: true },
              { text: 'さんにお願いするお手伝いの内容を入力してください。' },
            ]}
          />
          <SettingItems items={items} />
          <SettingBudget
            month={now.month}
            tempBudgets={tempBudgets}
            updateBudget={updateBudget}
          />

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
    </div>
  )
}

export default SettingApprover
