/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
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

const budgetSchema = yup.object({
  budget: yup
    .number()
    .typeError('半角数字で入力してください。')
    .integer('小数点は入力できません。')
    .positive('1円以上で設定してください。')
    .max(9999, '9999円まで設定可能です。'),
})

const schema = yup.object().shape({
  items: yup.array().of(itemSchema),
  budget: budgetSchema,
})

interface FormInputs {
  items: Item[]
  budget: Budget
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

  const methods = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (data: FormInputs) => {
    // settingAssistContentsHandler(data.items, data.editBudget)
  }

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
    </div>
  )
}

export default SettingApprover
