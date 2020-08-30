import React from 'react'
import * as firebase from 'firebase/app'
import { useDocument } from 'react-firebase-hooks/firestore'
import { registerApprovalUser } from 'domain/firestore'

import RegisterApprover from 'components/templates/RegisterApprover'
import PendingRegisterApprover from 'components/templates/RegisterApprover/pending'

const RegisterApproverPage: React.FC = () => {
  const [userDoc] = useDocument(
    firebase.firestore().doc(`users/${firebase.auth().currentUser?.uid}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  if (!userDoc) return null

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
