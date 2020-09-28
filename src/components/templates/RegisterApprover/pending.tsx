import React from 'react'

import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'
import InviteAssistant from 'components/organisms/InviteAssistant'

interface Props {
  myNickname: string
}
const PendingRegisterApprover: React.FC<Props> = ({ myNickname }) => {
  const classes = useSharedStyles()

  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: 'お手伝い', isEmphasis: true },
          { text: 'をお願いする人を' },
          { text: '招待', isEmphasis: true },
          { text: 'してください。' },
        ]}
      />
      <InviteAssistant myNickname={myNickname} />
    </div>
  )
}

export default PendingRegisterApprover
