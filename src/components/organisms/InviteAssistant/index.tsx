/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useEffect } from 'react'
import {
  makeStyles,
  createStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import EmailIcon from '@material-ui/icons/Email'
import AssignmentIcon from '@material-ui/icons/Assignment'
import Typography from '@material-ui/core/Typography'
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'

import Button from '@material-ui/core/Button'

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    inviteTextArea: {
      width: 0,
      height: 0,
      opacity: 0,
      resize: 'none',
      outline: 'none',
    },
  })
)

const useStylesBootstrap = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.secondary.light,
  },
  tooltip: {
    backgroundColor: theme.palette.secondary.light,
    fontSize: theme.typography.subtitle1.fontSize,
    padding: theme.spacing(2),
  },
}))

function BootstrapTooltip(props: TooltipProps) {
  const classes = useStylesBootstrap()
  return <Tooltip classes={classes} {...props} />
}

function LineIcon(props: SvgIconProps) {
  return (
    <div style={{ transform: 'scale(0.9)', marginTop: '4px' }}>
      <SvgIcon {...props}>
        <path d="m74.414 480.548h-36.214l25.607-25.607c13.807-13.807 22.429-31.765 24.747-51.246-59.127-38.802-88.554-95.014-88.554-153.944 0-108.719 99.923-219.203 256.414-219.203 165.785 0 254.682 101.666 254.682 209.678 0 108.724-89.836 210.322-254.682 210.322-28.877 0-59.01-3.855-85.913-10.928-25.467 26.121-59.973 40.928-96.087 40.928z" />
      </SvgIcon>
    </div>
  )
}

type TabValue = 'line' | 'mail' | 'clipboard'

interface Props {
  myNickname: string
  inviteOnetimeUrl: {
    host: string
    uid: string
    token: string
  } | null
  handleUpdateInviteOnetimeUrl: (isUpdate?: boolean) => void
}

const InviteAssistant: React.FC<Props> = ({
  myNickname,
  inviteOnetimeUrl,
  handleUpdateInviteOnetimeUrl,
}) => {
  const classes = useStyles()
  const theme = useTheme()

  const [tabValue, setTabValue] = React.useState<TabValue>('line')
  const [isShownTooltip, setIsShownTooltip] = React.useState(false)
  const inviteHiddenRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isShownTooltip) {
      setTimeout(() => {
        setIsShownTooltip(false)
      }, 2000)
    }
  }, [isShownTooltip])

  const handleChange = (
    _: React.ChangeEvent<Record<string, TabValue>>,
    newValue: TabValue
  ) => {
    setTabValue(newValue)
  }

  const generateOnetimeUrl = () => {
    const host = inviteOnetimeUrl?.host ?? ''
    const uid = inviteOnetimeUrl?.uid ?? ''
    const token = inviteOnetimeUrl?.token ?? ''

    return `${host}/login?invite_assistant=${uid}&token=${token}`
  }

  const generateSendHref = () => {
    const message = encodeURIComponent(
      `${myNickname}さんからお手伝いのお願いがきています。\n以下、URLより登録してください。\n${generateOnetimeUrl()}`
    )

    if (tabValue === 'line') {
      return `https://line.me/R/msg/text/?${message}`
    }

    return `mailto:?&subject=
    ${myNickname}さんからお手伝いのお願いがきています。&body=${message}`
  }

  return (
    <Box mt={8} mb={4}>
      <Paper square className={classes.root}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab
            icon={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <LineIcon
                width="512px"
                height="512px"
                viewBox="0 0 511.096 511.096"
              />
            }
            value="line"
          />
          <Tab icon={<EmailIcon />} value="mail" />
          <Tab icon={<AssignmentIcon />} value="clipboard" />
        </Tabs>
      </Paper>
      <Box
        mt="1px"
        px={2}
        py={3}
        bgcolor={theme.palette.common.white}
        boxShadow={theme.shadows[1]}
      >
        {tabValue === 'clipboard' ? (
          <Typography variant="h6" component="h2">
            以下のメッセージを
            <span style={{ color: theme.palette.primary.main }}>コピー</span>
            して共有してください。
          </Typography>
        ) : (
          <Typography variant="h6" component="h2">
            以下のメッセージを
            <span style={{ color: theme.palette.primary.main }}>
              {tabValue === 'line' ? 'LINE' : 'メール'}
            </span>
            で送信します。
          </Typography>
        )}

        <Box mt={2} pt={2} px={2} bgcolor={theme.palette.grey[100]}>
          <Typography
            variant="subtitle1"
            component="p"
            style={{ overflowWrap: 'break-word' }}
          >
            {myNickname}さんからお手伝いのお願いがきています。
            <br />
            以下、URLより登録してください。
            <br />
            {generateOnetimeUrl()}
          </Typography>
          <textarea
            ref={inviteHiddenRef}
            className={classes.inviteTextArea}
            defaultValue={`${myNickname}さんからお手伝いのお願いがきています。\n以下、URLより登録してください。\n${generateOnetimeUrl()}`}
          />
        </Box>

        <Box m={2} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            style={{ marginRight: theme.spacing(3) }}
            onClick={() => {
              handleUpdateInviteOnetimeUrl()
            }}
          >
            URLを更新
          </Button>
          {tabValue === 'clipboard' ? (
            <BootstrapTooltip
              open={isShownTooltip}
              title="コピーしました。"
              arrow
              placement="top"
              enterDelay={200}
              leaveDelay={500}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  if (inviteHiddenRef?.current) {
                    inviteHiddenRef.current.select()
                    document.execCommand('copy')
                    inviteHiddenRef.current.blur()
                    setIsShownTooltip(true)
                  }
                }}
              >
                コピー
              </Button>
            </BootstrapTooltip>
          ) : (
            <Button
              href={generateSendHref()}
              target="blank"
              rel="noreferrer"
              variant="contained"
              color="primary"
              size="large"
            >
              送信
            </Button>
          )}
        </Box>
        <Typography
          variant="subtitle2"
          component="p"
          color="error"
          align="center"
        >
          ※招待URLの有効期間は24時間となります。
        </Typography>
      </Box>
    </Box>
  )
}

export default InviteAssistant
