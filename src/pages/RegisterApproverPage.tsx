import React from 'react'

const RegisterApproverPage: React.FC = () => {
  return (
    <div>
      <h1>お手伝いをお願いしよう。</h1>
      <form>
        <label>
          <p>ニックネーム（50文字以内）</p>
          <input type="text" maxLength={50} />
        </label>
        <label>
          <p>お手伝いをお願いする人のメールアドレスまたは、電話番号</p>
          <input type="text" />
        </label>
        <button type="submit">登録</button>
      </form>
    </div>
  )
}

export default RegisterApproverPage
