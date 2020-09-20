import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import { useSharedStyles } from 'styles'
import NextActionText from 'components/organisms/NextActionText'

interface Props {
  registerApprovalUser: (nickname: string, inviteAddress: string) => void
}

const RegisterApprover: React.FC<Props> = ({ registerApprovalUser }) => {
  const classes = useSharedStyles()
  const theme = useTheme()

  const [nickname, setNickname] = useState('')
  const [inviteAddress, setInviteAddress] = useState('')

  return (
    <div className={classes.templateInner}>
      <NextActionText words={[{ text: 'お手伝いをお願いしよう。' }]} />

      <Box>
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
        <Typography
          style={{
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(1),
          }}
        >
          お手伝いをお願いする人のメールアドレス
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          value={inviteAddress}
          onChange={(e) => {
            setInviteAddress(e.target.value)
          }}
        />
      </Box>

      <Box my={8} mx="auto" maxWidth={theme.breakpoints.values.sm}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => {
            registerApprovalUser(nickname, inviteAddress)
          }}
        >
          登録
        </Button>
      </Box>
    </div>
  )
}

export default RegisterApprover
