import React, { useState, useEffect } from 'react'
import { registerAssistantUser } from 'domain/firestore'

const RegisterAssistantPage: React.FC = () => {
  const [nickName, setNickName] = useState('')
  const [approverNickName, setApproverNickName] = useState('')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setApproverNickName(searchParams.get('approver_nick_name') ?? '')
  }, [])

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
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            const searchParams = new URLSearchParams(window.location.search)
            const assistToApproverId = searchParams.get('invite_assistant')
            registerAssistantUser(nickName, assistToApproverId).catch((err) => {
              // eslint-disable-next-line no-alert
              window.alert(err.message)
            })
          }}
        >
          登録
        </button>
      </form>
    </div>
  )
}

export default RegisterAssistantPage
