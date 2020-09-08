import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import useInjection from './useInjection'

const WorkAssistantPage: React.FC = () => {
  const { isLoaded, renderType, now, items, budgets } = useInjection()

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (!isLoaded) return <div>loading...</div>

  return (
    <>
      <div>workするぞ！</div>
      <p>{now.month}</p>
      <p>{items[0].label}</p>
      <p>{budgets[0].budget}</p>
    </>
  )
}

export default WorkAssistantPage
