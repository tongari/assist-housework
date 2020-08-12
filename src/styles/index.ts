import { createGlobalStyle } from 'styled-components'
import { normalize } from 'styled-normalize'

// eslint-disable-next-line import/prefer-default-export
export const GlobalStyle = createGlobalStyle`
  ${normalize}
  input{
    width: 100%;
  }
`
