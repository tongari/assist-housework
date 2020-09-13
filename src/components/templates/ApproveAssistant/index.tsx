import React from 'react'

interface Props {
  assistantNickname: string
  setApprovedAssistantHandler: () => void
}

const ApproveAssistant: React.FC<Props> = ({
  assistantNickname,
  setApprovedAssistantHandler,
}) => {
  return (
    <div>
      <p>
        <strong>{assistantNickname}</strong>
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
