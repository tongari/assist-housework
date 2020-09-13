import React, { useState } from 'react'

interface Props {
  approverNickname: string
  registerAssistantUserHandler: (nickname: string) => void
}

const RegisterAssistant: React.FC<Props> = ({
  approverNickname,
  registerAssistantUserHandler,
}) => {
  const [nickname, setNickname] = useState('')

  return (
    <div>
      <h1>{approverNickname}さんのお手伝いをしてみよう。</h1>
      <form>
        <label>
          <p>ニックネーム（50文字以内）</p>
          <input
            type="text"
            maxLength={50}
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            registerAssistantUserHandler(nickname)
          }}
        >
          登録
        </button>
      </form>
    </div>
  )
}

export default RegisterAssistant
