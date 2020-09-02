import React from 'react'

interface Props {
  assistantNickName: string
  setApprovedAssistantHandler: () => void
}

const ApproveAssistant: React.FC<Props> = ({
  assistantNickName,
  setApprovedAssistantHandler,
}) => {
  return (
    <div>
      <p>
        <strong>{assistantNickName}</strong>
        さんを承認しますか？
      </p>
      <button
        type="button"
        onClick={() => {
          setApprovedAssistantHandler()
        }}
      >
        承認
      </button>
    </div>
  )
}

export default ApproveAssistant
