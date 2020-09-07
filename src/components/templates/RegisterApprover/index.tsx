import React, { useState } from 'react'

interface Props {
  registerApprovalUser: (nickName: string, inviteAddress: string) => void
}

const RegisterApprover: React.FC<Props> = ({ registerApprovalUser }) => {
  const [nickName, setNickName] = useState('')
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
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value)
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
          onClick={(e) => {
            e.preventDefault()
            registerApprovalUser(nickName, inviteAddress)
          }}
        >
          登録
        </button>
      </form>
    </div>
  )
}

export default RegisterApprover
