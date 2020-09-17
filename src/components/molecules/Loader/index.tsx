import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'fixed',
      zIndex: 9999,
      width: '100vw',
      height: '100vh',
      top: 0,
      left: 0,
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '40px',
      height: '40px',
      marginTop: '-20px',
      marginLeft: '-20px',
      transformOrigin: 'center center',
    },
  })
)

interface Props {
  isLoading: boolean
}
const Loader: React.FC<Props> = ({ isLoading }) => {
  const classes = useStyles()

  return (
    <Fade
      in={isLoading}
      style={{
        opacity: isLoading ? 1 : 0,
      }}
      timeout={800}
    >
      <div className={classes.container}>
        <CircularProgress className={classes.loader} />
      </div>
    </Fade>
  )
}

export default Loader
