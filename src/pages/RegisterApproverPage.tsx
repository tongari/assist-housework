import React from 'react'
import { Redirect } from 'react-router-dom'
import * as firebase from 'firebase/app'
import { useDocument } from 'react-firebase-hooks/firestore'
import { registerApprovalUser } from 'domain/firestore'

import RegisterApprover from 'components/templates/RegisterApprover'
import PendingRegisterApprover from 'components/templates/RegisterApprover/pending'
import { Roles } from 'config/roles'
import { Paths } from 'config/paths'

const RegisterApproverPage: React.FC = () => {
  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`)
  )

  if (!userDoc) return null

  const roleRef = userDoc.get('roleRef')
  const watchId = userDoc.get('watchId')

  if (roleRef.id !== Roles.Approver) {
    return <Redirect to={Paths.NotFound} />
  }

  if (watchId) {
    return <Redirect to={Paths.ApproveAssistant} />
  }

  return (
    <>
      {userDoc.data() ? (
        <PendingRegisterApprover
          inviteAddress={userDoc?.get('inviteAddress')}
        />
      ) : (
        <RegisterApprover registerApprovalUser={registerApprovalUser} />
      )}
    </>
  )
}

export default RegisterApproverPage
