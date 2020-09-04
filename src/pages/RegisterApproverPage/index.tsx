import React from 'react'
import { Redirect } from 'react-router-dom'
import { registerApprovalUser } from 'domain/firestore'

import RegisterApprover from 'components/templates/RegisterApprover'
import PendingRegisterApprover from 'components/templates/RegisterApprover/pending'
import { Roles, Paths } from 'types'
import useInitialize from './useInitialize'

const RegisterApproverPage: React.FC = () => {
  const { isLoaded, userData } = useInitialize()

  if (!isLoaded) {
    return <div>loading...</div>
  }

  if (userData && userData?.role !== Roles.Approver) {
    return <Redirect to={Paths.NotFound} />
  }

  if (userData?.inviteAddress) {
    return <PendingRegisterApprover inviteAddress={userData.inviteAddress} />
  }

  if (userData?.watchId) {
    return <Redirect to={Paths.ApproveAssistant} />
  }

  return <RegisterApprover registerApprovalUser={registerApprovalUser} />
}

export default RegisterApproverPage
