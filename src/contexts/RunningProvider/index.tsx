import React, { createContext } from 'react'
import useInjection, { InjectionResult } from './useInjection'

export const RunningContext = createContext<InjectionResult>({
  isRunningContextLoaded: false,
  budget: 0,
  totalPrice: 0,
  unApprovePrice: 0,
  watchMonth: '',
  isNotFound: false,
  convertGroupDateDeals: () => [],
})

const RunningProvider: React.FC = ({ children }) => {
  const {
    isRunningContextLoaded,
    budget,
    totalPrice,
    unApprovePrice,
    watchMonth,
    isNotFound,
    convertGroupDateDeals,
  } = useInjection()

  return (
    <RunningContext.Provider
      value={{
        isRunningContextLoaded,
        budget,
        totalPrice,
        unApprovePrice,
        watchMonth,
        isNotFound,
        convertGroupDateDeals,
      }}
    >
      {children}
    </RunningContext.Provider>
  )
}

export default RunningProvider
