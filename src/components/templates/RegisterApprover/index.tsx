import React from 'react'

import { useSharedStyles } from 'styles'
import SettingNickName from 'components/molecules/SettingNickName'
import NextActionText from 'components/molecules/NextActionText'

interface FormInputs {
  nickname: string
}

interface Props {
  registerApprovalUser: (nickname: string) => void
}

const RegisterApprover: React.FC<Props> = ({ registerApprovalUser }) => {
  const classes = useSharedStyles()

  return (
    <div className={classes.templateInner}>
      <NextActionText words={[{ text: 'お手伝いをお願いしよう。' }]} />
      <SettingNickName handleSubmitForm={registerApprovalUser} />
    </div>
  )
}

export default RegisterApprover
