import { createMuiTheme } from '@material-ui/core/styles'

export const globalTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          fontFamily:
            '"Roboto","Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif',
        },
      },
    },
  },
})
