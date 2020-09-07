import { Item, Budget, Deal } from 'types'

type Props =
  | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  | undefined

export const convertedItems = (items: Props): Item[] => {
  return (
    items?.docs.map((item) => {
      return {
        itemId: item.get('itemId'),
        label: item.get('label'),
        price: item.get('price'),
      }
    }) ?? []
  )
}

export const convertedBudgets = (budgets: Props): Budget[] => {
  return (
    budgets?.docs.map((budget) => {
      return {
        year: budget.get('year'),
        month: budget.get('month'),
        budget: budget.get('budget'),
      }
    }) ?? []
  )
}

export const convertedDeals = (deals: Props): Deal[] => {
  return (
    deals?.docs.map((deal) => {
      return {
        date: deal.get('date'),
        day: deal.get('day'),
        itemId: deal.get('itemId'),
        itemLabel: deal.get('itemLabel'),
        price: deal.get('price'),
      }
    }) ?? []
  )
}
