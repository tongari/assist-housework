import React, { useCallback, useEffect, useState } from 'react'

import { useSharedStyles } from 'styles'
import Loader from 'components/molecules/Loader'
import NextActionText from 'components/molecules/NextActionText'
import InviteAssistant from 'components/organisms/InviteAssistant'
import { fetchInviteOnetimeUrl } from 'domain/firestore'

interface Props {
  myNickname: string
}
const PendingRegisterApprover: React.FC<Props> = ({ myNickname }) => {
  const classes = useSharedStyles()
  const [inviteOnetimeUrl, setInviteOnetimeUrl] = useState(null)

  useEffect(() => {
    let isCleaned = false
    if (!isCleaned)
      fetchInviteOnetimeUrl().then((res) => {
        setInviteOnetimeUrl(res.data)
      })
    return () => {
      isCleaned = true
    }
  }, [])

  const handleUpdateInviteOnetimeUrl = useCallback(() => {
    fetchInviteOnetimeUrl(true).then((res) => {
      setInviteOnetimeUrl(res.data)
    })
  }, [])

  return (
    <>
      <Loader isLoading={!inviteOnetimeUrl} />
      {inviteOnetimeUrl && (
        <div className={classes.templateInner}>
          <NextActionText
            words={[
              { text: 'お手伝い', isEmphasis: true },
              { text: 'をお願いする人を' },
              { text: '招待', isEmphasis: true },
              { text: 'してください。' },
            ]}
          />
          <InviteAssistant
            myNickname={myNickname}
            inviteOnetimeUrl={inviteOnetimeUrl}
            handleUpdateInviteOnetimeUrl={handleUpdateInviteOnetimeUrl}
          />
        </div>
      )}
    </>
  )
}

export default PendingRegisterApprover
