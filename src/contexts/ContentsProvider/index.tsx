import React, { createContext } from 'react'
import useInjection, { InjectionResult } from './useInjection'

export const ContentsContext = createContext<InjectionResult>({
  isContentsContextLoaded: false,
  assistantNickname: undefined,
  now: {
    year: '',
    month: '',
    date: '',
    day: '',
  },
  items: [],
  budgets: [],
  deals: [],
  todayDeals: [],
  calculationDeals: [],
})

const ContentsProvider: React.FC = ({ children }) => {
  const {
    isContentsContextLoaded,
    assistantNickname,
    now,
    items,
    budgets,
    deals,
    todayDeals,
    calculationDeals,
  } = useInjection()

  return (
    <ContentsContext.Provider
      value={{
        isContentsContextLoaded,
        assistantNickname,
        now,
        items,
        budgets,
        deals,
        todayDeals,
        calculationDeals,
      }}
    >
      {children}
    </ContentsContext.Provider>
  )
}

export default ContentsProvider
