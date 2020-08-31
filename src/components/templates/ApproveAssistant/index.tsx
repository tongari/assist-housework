import React from 'react'

interface Props {
  assistantNickName: string | null
  validPage: boolean
  setApprovedAssistantHandler: () => void
}

const ApproveAssistant: React.FC<Props> = ({
  assistantNickName = '',
  validPage,
  setApprovedAssistantHandler,
}) => {
  return (
    <>
      {validPage ? (
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
      ) : (
        <p>届いたメールのURLからアクセスしてください</p>
      )}
    </>
  )
}

export default ApproveAssistant
