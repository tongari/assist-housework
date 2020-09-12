import React, { createContext } from 'react'
import useInjection, { InjectionResult } from './useInjection'

export const CalculationContext = createContext<InjectionResult>({
  isCalculationContextLoaded: false,
  totalPrice: 0,
  unApprovePrice: 0,
  watchMonth: '',
  isNotFound: false,
})

const CalculationProvider: React.FC = ({ children }) => {
  const {
    isCalculationContextLoaded,
    totalPrice,
    unApprovePrice,
    watchMonth,
    isNotFound,
  } = useInjection()

  return (
    <CalculationContext.Provider
      value={{
        isCalculationContextLoaded,
        totalPrice,
        unApprovePrice,
        watchMonth,
        isNotFound,
      }}
    >
      {children}
    </CalculationContext.Provider>
  )
}

export default CalculationProvider
