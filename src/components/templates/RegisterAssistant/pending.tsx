import React from 'react'

interface Props {
  approverNickname: string
}

const PendingRegisterAssistant: React.FC<Props> = ({ approverNickname }) => {
  return (
    <div>
      <p>
        ただいま、
        <br />
        <strong>{approverNickname}</strong>
        <br />
        さんの承認待ちです。
      </p>
    </div>
  )
}

export default PendingRegisterAssistant
