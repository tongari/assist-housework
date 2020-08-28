import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sendGrid from '@sendgrid/mail'
import { HttpsError } from 'firebase-functions/lib/providers/https'

admin.initializeApp()

const success = {
  message: 'success',
}

interface SendAssistantInviteMailProps {
  inviteAddress: string
  nickName: string
}
exports.sendAssistantInviteMail = functions.https.onCall(
  async (
    { inviteAddress, nickName }: SendAssistantInviteMailProps,
    context
  ) => {
    const apiKey = functions.config().send_grid.key
    const fromAddress = functions.config().send_grid.from_address
    sendGrid.setApiKey(apiKey)

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
    const approverRoleRef = await approverDoc.get('roleRef').get()
    const assistantAddress = context.auth?.token.email

    if (assistantAddress !== approverDoc.get('inviteAddress')) {
      throw new HttpsError(
        'invalid-argument',
        '招待されたメールアドレスでログインしてください。'
      )
    }

    // TODO: フロントと共通のenumを使うなどを考慮
    if (approverRoleRef.id !== '2') {
      throw new HttpsError(
        'invalid-argument',
        '招待メールを貰ったユーザの権限が不適切です。'
      )
    }

    const result = await approver.update({
      assistantUserIds: admin.firestore.FieldValue.arrayUnion(assistantId),
    })

    functions.logger.info('addAssistantUserIds', result)

    return success
  }
)
