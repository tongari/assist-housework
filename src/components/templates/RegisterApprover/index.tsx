import React, { useState } from 'react'

interface Props {
  registerApprovalUser: (nickname: string, inviteAddress: string) => void
}

const RegisterApprover: React.FC<Props> = ({ registerApprovalUser }) => {
  const [nickname, setNickname] = useState('')
  const [inviteAddress, setInviteAddress] = useState('')

  return (
    <div>
      <h1>お手伝いをお願いしよう。</h1>
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
        <label>
          <p>お手伝いをお願いする人のメールアドレス</p>
          <input
            type="text"
            value={inviteAddress}
            onChange={(e) => {
              setInviteAddress(e.target.value)
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            registerApprovalUser(nickname, inviteAddress)
          }}
        >
          登録
        </button>
      </form>
    </div>
  )
}

export default RegisterApprover
