import React from 'react'

import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'

interface Props {
  inviteAddress: string
}

const PendingRegisterApprover: React.FC<Props> = ({ inviteAddress }) => {
  const classes = useSharedStyles()

  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: 'ただいま' },
          { text: inviteAddress, isEmphasis: true },
          { text: 'さんの登録待ちです。' },
        ]}
      />
    </div>
  )
}

export default PendingRegisterApprover
