import React from 'react'

interface Props {
  approverNickName: string
}

const PendingRegisterAssistant: React.FC<Props> = ({ approverNickName }) => {
  return (
    <div>
      <p>
        ただいま、
        <br />
        <strong>{approverNickName}</strong>
        <br />
        さんの登録待ちです。
      </p>
    </div>
  )
}

export default PendingRegisterAssistant
