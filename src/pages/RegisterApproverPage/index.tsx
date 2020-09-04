import React from 'react'
import { Redirect } from 'react-router-dom'
import { registerApprovalUser } from 'domain/firestore'

import RegisterApprover from 'components/templates/RegisterApprover'
import PendingRegisterApprover from 'components/templates/RegisterApprover/pending'
import { Paths } from 'types'
import useInitialize from './useInitialize'

const RegisterApproverPage: React.FC = () => {
  const { isLoaded, renderType, inviteAddress } = useInitialize()

  if (!isLoaded) {
    return <div>loading...</div>
  }

  if (renderType === 'NotFound') {
    return <Redirect to={Paths.NotFound} />
  }

  if (renderType === 'Pending') {
    return <PendingRegisterApprover inviteAddress={inviteAddress} />
  }

  if (renderType === 'ApproveAssistant') {
    return <Redirect to={Paths.ApproveAssistant} />
  }

  return <RegisterApprover registerApprovalUser={registerApprovalUser} />
}

export default RegisterApproverPage
