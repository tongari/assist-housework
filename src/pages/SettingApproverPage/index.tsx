import React from 'react'
import { Redirect } from 'react-router-dom'

import { Paths } from 'types'
import useInjection from './useInjection'

const SettingApproverPage: React.FC = () => {
  const { isLoaded, renderType, assistantNickname, now, items } = useInjection()

  if (!isLoaded) return <div>loading...</div>

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  return (
    <div>
      <p>{assistantNickname}</p>
      <p>{now.year}</p>
      <p>{now.month}</p>
      <p>{now.date}</p>
      <p>{now.day}</p>
      <ul>
        {items?.docs.map((item) => {
          return (
            <li>
              <p>{item.get('name')}</p>
              <p>{item.get('price')}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SettingApproverPage
