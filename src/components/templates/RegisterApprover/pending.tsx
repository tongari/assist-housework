import React from 'react'

interface Props {
  inviteAddress: string
}

const PendingRegisterApprover: React.FC<Props> = ({ inviteAddress }) => {
  return (
    <div>
      <p>
        ただいま、
        <br />
        <strong>{inviteAddress}</strong>
        <br />
        さんの登録待ちです。
      </p>
    </div>
  )
}

export default PendingRegisterApprover
