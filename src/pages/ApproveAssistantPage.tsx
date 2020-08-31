import React, { useEffect, useState } from 'react'
import { hasAssistantUserIds, setApprovedAssistant } from 'domain/firestore'
import ApproveAssistant from 'components/templates/ApproveAssistant'

const ApproveAssistantPage: React.FC = () => {
  const [validPage, setValidPage] = useState<null | boolean>(null)
  const [assistantNickName, setAssistantNickName] = useState<string>('')
  const [assistantId, setAssistantId] = useState<string>('')

  const setupPage = async () => {
    const searchParams = new URLSearchParams(window.location.search)
    setAssistantNickName(searchParams.get('assistant_nick_name') ?? '')

    const id = searchParams.get('assistant') ?? ''
    setAssistantId(id)
    const valid = await hasAssistantUserIds(id)
    setValidPage(valid)
  }

  useEffect(() => {
    setupPage()
  }, [])

  const setApprovedAssistantHandler = () => {
    setApprovedAssistant(assistantId)
  }

  if (validPage === null) return null

  return (
    <>
      <ApproveAssistant
        assistantNickName={assistantNickName}
        validPage={validPage}
        setApprovedAssistantHandler={setApprovedAssistantHandler}
      />
    </>
  )
}

export default ApproveAssistantPage
