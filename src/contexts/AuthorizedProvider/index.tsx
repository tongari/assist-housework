import React, { createContext } from 'react'
import useInjection, { InjectionResult } from './useInjection'

export const AuthorizedContext = createContext<InjectionResult>({
  isAuthorizeContextLoaded: false,
  authenticated: undefined,
  isAuthLoading: false,
  authError: undefined,
  userInfo: null,
  now: {
    year: '',
    month: '',
    date: '',
    day: '',
  },
})

const AuthorizedProvider: React.FC = ({ children }) => {
  const {
    isAuthorizeContextLoaded,
    authenticated,
    isAuthLoading,
    authError,
    userInfo,
    now,
  } = useInjection()

  return (
    <AuthorizedContext.Provider
      value={{
        isAuthorizeContextLoaded,
        authenticated,
        isAuthLoading,
        authError,
        userInfo,
        now,
      }}
    >
      {children}
    </AuthorizedContext.Provider>
  )
}

export default AuthorizedProvider
