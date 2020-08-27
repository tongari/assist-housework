import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sendGrid from '@sendgrid/mail'

admin.initializeApp()

const success = {
  message: 'success',
}

const fail = {
  message: 'fail',
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

interface AddAssistantUserIds {
  approverId: string
}
exports.addAssistantUserIds = functions.https.onCall(
  async ({ approverId }: AddAssistantUserIds, context) => {
    const assistantId = context.auth?.uid
    if (!approverId || !assistantId) return fail

    const approver = admin.firestore().collection('users').doc(approverId)
    const approverDoc = await approver.get()
    const approverRoleRef = await approverDoc.get('roleRef').get()

    // TODO: フロントと共通のenumを使うなどを考慮
    if (approverRoleRef.id !== '2') return fail

    const result = await approver.update({
      assistantUserIds: admin.firestore.FieldValue.arrayUnion(assistantId),
    })

    functions.logger.info('addAssistantUserIds', result)

    return success
  }
)
