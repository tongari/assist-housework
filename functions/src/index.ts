import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sendGrid from '@sendgrid/mail'
import { HttpsError } from 'firebase-functions/lib/providers/https'

admin.initializeApp()

const success = {
  message: 'success',
}

const apiKey = functions.config().send_grid.key
const fromAddress = functions.config().send_grid.from_address
sendGrid.setApiKey(apiKey)

interface SendAssistantInviteMailProps {
  inviteAddress: string
  nickName: string
}
exports.sendAssistantInviteMail = functions.https.onCall(
  async (
    { inviteAddress, nickName }: SendAssistantInviteMailProps,
    context
  ) => {
    const host = context.rawRequest.headers.origin
    const msg = {
      to: inviteAddress,
      from: fromAddress,
      subject: `${nickName}さんからお手伝いのお願いがきています`,
      html: `
          <p>${nickName}さんからお手伝いのお願いがきています</p>
          <p>以下、URLより登録してください。</p>
          <p>${host}/login?invite_assistant=${context.auth?.uid}</p>
        `,
    }
    const result = await sendGrid.send(msg)
    functions.logger.info('sendAssistantInviteMail', result)
    return success
  }
)

interface SendApproveAssistantToApproverProps {
  approverId: string
}

exports.sendApproveAssistantToApprover = functions.https.onCall(
  async ({ approverId }: SendApproveAssistantToApproverProps, context) => {
    const assistantId = context.auth?.uid

    if (!assistantId) {
      throw new HttpsError('invalid-argument', 'invalid assistantId')
    }

    const approver = await admin.auth().getUser(approverId)
    const toAddress = approver.email

    const assistant = admin.firestore().collection('users').doc(assistantId)
    const assistantDoc = await assistant.get()
    const assistantNickName = assistantDoc.get('nickName')

    const host = context.rawRequest.headers.origin

    const msg = {
      to: toAddress,
      from: fromAddress,
      subject: `${assistantNickName}さんから承認のお願いがきています`,
      html: `
          <p>${assistantNickName}さんから承認のお願いがきています</p>
          <p>以下、URLより承認してください。</p>
          <p>${host}/approve-assistant</p>
        `,
    }
    const result = await sendGrid.send(msg)
    functions.logger.info('sendAssistantToApprove', result)

    return success
  }
)

interface AddAssistantUserIdsProps {
  approverId: string
}
exports.addAssistantUserIds = functions.https.onCall(
  async ({ approverId }: AddAssistantUserIdsProps, context) => {
    const assistantId = context.auth?.uid
    if (!approverId || !assistantId) {
      throw new HttpsError(
        'invalid-argument',
        '招待されたメールのURLから登録してください'
      )
    }

    const approver = admin.firestore().collection('users').doc(approverId)
    const approverDoc = await approver.get()
    const assistantAddress = context.auth?.token.email

    if (assistantAddress !== approverDoc.get('inviteAddress')) {
      throw new HttpsError(
        'invalid-argument',
        '招待されたメールアドレスでログインしてください。'
      )
    }

    const approverRoleRef = await approverDoc.get('roleRef').get()
    // TODO: フロントと共通のenumを使うなどを考慮
    if (approverRoleRef.id !== '2') {
      throw new HttpsError(
        'invalid-argument',
        '招待メールを貰ったユーザの権限が不適切です。'
      )
    }

    await approver.update({
      watchId: assistantId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    const statusRef = admin.firestore().collection('status')
    const result = await approver
      .collection('/assistantUserIds')
      .doc(assistantId)
      .set({
        assistantUserId: assistantId,
        statusRef: statusRef.doc('1'), // TODO: フロントと共通のenumを使うなどを考慮
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

    functions.logger.info('addAssistantUserIds', result)

    return success
  }
)

interface GetNickName {
  userId: string | null
}
exports.getNickName = functions.https.onCall(
  async ({ userId }: GetNickName) => {
    if (!userId) {
      throw new HttpsError('invalid-argument', 'nothing userId')
    }
    const user = admin.firestore().collection('users').doc(userId)
    functions.logger.info('getNickName', user)
    const userDoc = await user.get()
    return {
      nickName: userDoc.get('nickName'),
    }
  }
)
