import React from 'react'

import { useSharedStyles } from 'styles'
import SettingNickName from 'components/molecules/SettingNickName'
import NextActionText from 'components/molecules/NextActionText'

interface Props {
  approverNickname: string
  registerAssistantUserHandler: (nickname: string) => void
}

const RegisterAssistant: React.FC<Props> = ({
  approverNickname,
  registerAssistantUserHandler,
}) => {
  const classes = useSharedStyles()

  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: approverNickname, isEmphasis: true },
          { text: 'さんのお手伝いをしてみよう。' },
        ]}
      />
      <SettingNickName handleSubmitForm={registerAssistantUserHandler} />
    </div>
  )
}

export default RegisterAssistant
