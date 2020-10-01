import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import { useSharedStyles } from 'styles'
import NextActionText from 'components/molecules/NextActionText'

interface Props {
  assistantNickname: string
  setApprovedAssistantHandler: () => void
}

const ApproveAssistant: React.FC<Props> = ({
  assistantNickname,
  setApprovedAssistantHandler,
}) => {
  const classes = useSharedStyles()
  const theme = useTheme()

  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: assistantNickname, isEmphasis: true },
          { text: 'さんを承認しますか？' },
        ]}
      />

      <Box my={8} mx="auto" maxWidth={theme.breakpoints.values.sm}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => {
            setApprovedAssistantHandler()
          }}
        >
          承認
        </Button>
      </Box>
    </div>
  )
}

export default ApproveAssistant
