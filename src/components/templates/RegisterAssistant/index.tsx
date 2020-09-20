import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'

interface Props {
  approverNickname: string
  registerAssistantUserHandler: (nickname: string) => void
}

const RegisterAssistant: React.FC<Props> = ({
  approverNickname,
  registerAssistantUserHandler,
}) => {
  const classes = useSharedStyles()
  const theme = useTheme()

  const [nickname, setNickname] = useState('')

  return (
    <div className={classes.templateInner}>
      <NextActionText
        words={[
          { text: approverNickname, isEmphasis: true },
          { text: 'さんのお手伝いをしてみよう。' },
        ]}
      />
      <Typography
        style={{
          marginBottom: theme.spacing(1),
        }}
      >
        自分のニックネーム（50文字以内）
      </Typography>
      <TextField
        variant="outlined"
        fullWidth
        inputProps={{
          maxLength: 50,
        }}
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value)
        }}
      />
      <Box my={8} mx="auto" maxWidth={theme.breakpoints.values.sm}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => {
            registerAssistantUserHandler(nickname)
          }}
        >
          登録
        </Button>
      </Box>
    </div>
  )
}

export default RegisterAssistant
