import React from 'react'
import { Redirect } from 'react-router-dom'
import { registerApprovalUser } from 'domain/firestore'

import Loader from 'components/molecules/Loader'
import RegisterApprover from 'components/templates/RegisterApprover'
import PendingRegisterApprover from 'components/templates/RegisterApprover/pending'
import { Paths } from 'types'
import useInjection from './useInjection'

const RegisterApproverPage: React.FC = () => {
  const { isLoaded, renderType, inviteAddress } = useInjection()

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Pending' && inviteAddress) {
    return (
      <>
        <Loader isLoading={!isLoaded} />
        {isLoaded && <PendingRegisterApprover inviteAddress={inviteAddress} />}
      </>
    )
  }

  if (renderType === 'ApproveAssistant') {
    return <Redirect to={Paths.ApproveAssistant} />
  }

  return (
    <>
      <Loader isLoading={!isLoaded} />
      {isLoaded && (
        <RegisterApprover registerApprovalUser={registerApprovalUser} />
      )}
    </>
  )
}

export default RegisterApproverPage
