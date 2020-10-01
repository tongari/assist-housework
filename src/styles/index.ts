import {
  createMuiTheme,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles'

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
      marginTop: theme.spacing(1),
      color: theme.palette.error.main,
    },
  })
)
