import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as yup from 'yup'

import {
  makeStyles,
  createStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      marginTop: theme.spacing(1),
      color: theme.palette.error.main,
    },
  })
)

interface FormInputs {
  nickname: string
}

interface Props {
  handleSubmitForm: (nickname: string) => void
}

const SettingNickName: React.FC<Props> = ({ handleSubmitForm }) => {
  const classes = useStyles()
  const theme = useTheme()

  const schema = yup.object().shape({
    nickname: yup
      .string()
      .required('必須項目です。')
      .max(50, '50文字以内で設定してください。'),
  })

  const { register, handleSubmit, errors } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormInputs) => {
    handleSubmitForm(data.nickname)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Typography
          style={{
            marginBottom: theme.spacing(1),
          }}
        >
          自分のニックネーム
        </Typography>
        <TextField
          name="nickname"
          variant="outlined"
          fullWidth
          inputRef={register}
          error={!!errors?.nickname}
          inputProps={{
            placeholder: '50文字以内で設定してください。',
            autoCorrect: 'off',
            autoCapitalize: 'off',
            autoComplete: 'off',
          }}
        />
        {errors?.nickname && (
          <Typography className={classes.error}>
            {errors.nickname.message}
          </Typography>
        )}
      </Box>

      <Box my={8} mx="auto" maxWidth={theme.breakpoints.values.sm}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          登録
        </Button>
      </Box>
    </form>
  )
}

export default SettingNickName
