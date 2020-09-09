import React, { useState } from 'react'

interface Props {
  approverNickName: string
  registerAssistantUserHandler: (nickName: string) => void
}

const RegisterAssistant: React.FC<Props> = ({
  approverNickName,
  registerAssistantUserHandler,
}) => {
  const [nickName, setNickName] = useState('')

  return (
    <div>
      <h1>{approverNickName}さんのお手伝いをしてみよう。</h1>
      <form>
        <label>
          <p>ニックネーム（50文字以内）</p>
          <input
            type="text"
            maxLength={50}
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value)
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            registerAssistantUserHandler(nickName)
          }}
        >
          登録
        </button>
      </form>
    </div>
  )
}

export default RegisterAssistant
