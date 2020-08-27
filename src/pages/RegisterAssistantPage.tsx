import React, { useState } from 'react'
import { registerAssistantUser } from 'domain/firestore'

const RegisterAssistantPage: React.FC = () => {
  const [nickName, setNickName] = useState('')

  return (
    <div>
      <h1>○○さんのお手伝いしてみよう。</h1>
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
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            const searchParams = new URLSearchParams(window.location.search)
            const assistToApproverId = searchParams.get('invite_assistant')
            registerAssistantUser(nickName, assistToApproverId)
          }}
        >
          登録
        </button>
      </form>
    </div>
  )
}

export default RegisterAssistantPage
