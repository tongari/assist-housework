import {
  createMuiTheme,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles'

import indigo from '@material-ui/core/colors/indigo'
import teal from '@material-ui/core/colors/teal'

export const globalTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          fontFamily:
            '"Roboto","Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif',
        },
        li: {
          listStyle: 'none',
        },
      },
    },
  },
})

export const approverTheme = createMuiTheme({
  palette: {
    primary: {
      main: teal[500],
    },
    secondary: {
      main: indigo[500],
    },
  },
})

export const assistantTheme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: teal[500],
    },
  },
})

export const useSharedStyles = makeStyles((theme: Theme) =>
  createStyles({
    templateInner: {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },

      maxWidth: theme.breakpoints.values.md,
      margin: 'auto',
      padding: `0 ${theme.spacing(2)}px ${theme.spacing(8)}px ${theme.spacing(
        2
      )}px`,
    },
    errorMessage: {
      paddingTop: theme.spacing(1),
      color: theme.palette.error.main,
    },
  })
)
