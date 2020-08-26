import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sendGrid from '@sendgrid/mail'

admin.initializeApp()

interface SendAssistantInviteMailProps {
  inviteAddress: string
  nickName: string
}
exports.sendAssistantInviteMail = functions.https.onCall(
  async (data: SendAssistantInviteMailProps, context) => {
    const apiKey = functions.config().send_grid.key
    const fromAddress = functions.config().send_grid.from_address
    sendGrid.setApiKey(apiKey)

    const host = context.rawRequest.headers.origin
    const msg = {
      to: data.inviteAddress,
      from: fromAddress,
      subject: `${data.nickName}さんからお手伝いのお願いがきています`,
      html: `
          <p>${data.nickName}さんからお手伝いのお願いがきています</p>
          <p>以下、URLより登録してください。</p>
          <p>${host}/login?inviteassitant=${context.auth?.uid}</p>
        `,
    }
    const result = await sendGrid.send(msg)
    functions.logger.info('sendAssistantInviteMail', result)
    return {
      message: 'complete',
    }
  }
)
