import React from 'react'
import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'

interface Props {
  approverNickname: string
}

const PendingRegisterAssistant: React.FC<Props> = ({ approverNickname }) => {
  const classes = useSharedStyles()
  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: 'ただいま、' },
          { text: approverNickname, isEmphasis: true },
          { text: 'さんの承認待ちです。' },
        ]}
      />
    </div>
  )
}

export default PendingRegisterAssistant
