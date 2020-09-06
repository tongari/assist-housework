import React, { createContext } from 'react'
import useAuthorizedProviderInjection, {
  UserInfo,
} from './useAuthorizedProviderInjection'

interface Props {
  isLoaded: boolean
  authenticated: firebase.User | undefined
  isAuthLoading: boolean
  authError: firebase.auth.Error | undefined
  userInfo: UserInfo | null
}

export const AuthorizedContext = createContext<Props>({
  isLoaded: false,
  authenticated: undefined,
  isAuthLoading: false,
  authError: undefined,
  userInfo: null,
})

const AuthorizedProvider: React.FC = ({ children }) => {
  const {
    isLoaded,
    authenticated,
    isAuthLoading,
    authError,
    userInfo,
  } = useAuthorizedProviderInjection()

  return (
    <AuthorizedContext.Provider
      value={{
        isLoaded,
        authenticated,
        isAuthLoading,
        authError,
        userInfo,
      }}
    >
      {children}
    </AuthorizedContext.Provider>
  )
}

export default AuthorizedProvider
