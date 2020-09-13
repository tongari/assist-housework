import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sendGrid from '@sendgrid/mail'
import { HttpsError } from 'firebase-functions/lib/providers/https'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ja } from 'date-fns/locale'

admin.initializeApp()

const success = {
  message: 'success',
}

const apiKey = functions.config().send_grid.key
const fromAddress = functions.config().send_grid.from_address
sendGrid.setApiKey(apiKey)

interface SendAssistantInviteMailProps {
  inviteAddress: string
  nickname: string
}
exports.sendAssistantInviteMail = functions.https.onCall(
  async (
    { inviteAddress, nickname }: SendAssistantInviteMailProps,
    context
  ) => {
    const host = context.rawRequest.headers.origin
    const msg = {
      to: inviteAddress,
      from: fromAddress,
      subject: `${nickname}さんからお手伝いのお願いがきています`,
      html: `
          <p>${nickname}さんからお手伝いのお願いがきています</p>
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
    const assistantNickname = assistantDoc.get('nickname')

    const host = context.rawRequest.headers.origin

    const msg = {
      to: toAddress,
      from: fromAddress,
      subject: `${assistantNickname}さんから承認のお願いがきています`,
      html: `
          <p>${assistantNickname}さんから承認のお願いがきています</p>
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

    if (
      assistantAddress !== approverDoc.get('currentWatchUser').inviteAddress
    ) {
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

    const result = await approver.set(
      {
        currentWatchUser: {
          id: assistantId,
        },
        assistantUserIds: admin.firestore.FieldValue.arrayUnion(assistantId),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    functions.logger.info('addAssistantUserIds', result)

    return success
  }
)

interface GetNickname {
  userId: string | null
}
exports.getNickname = functions.https.onCall(
  async ({ userId }: GetNickname) => {
    if (!userId) {
      throw new HttpsError('invalid-argument', 'nothing userId')
    }
    const user = admin.firestore().collection('users').doc(userId)
    functions.logger.info('getNickname', user)
    const userDoc = await user.get()
    return {
      nickname: userDoc.get('nickname'),
    }
  }
)

exports.getServerTime = functions.https.onCall(async () => {
  const serverDate = admin.firestore.Timestamp.now().toDate()

  const timeZone = 'Asia/Tokyo'
  const zonedDate = utcToZonedTime(serverDate, timeZone)

  const year = format(zonedDate, 'yyyy', { locale: ja })
  const month = format(zonedDate, 'M', { locale: ja })
  const date = format(zonedDate, 'd', { locale: ja })
  const day = format(zonedDate, 'E', { locale: ja })
  const hour = format(zonedDate, 'HH', { locale: ja })
  const minute = format(zonedDate, 'm', { locale: ja })

  return {
    original: zonedDate.toUTCString(),
    year,
    month,
    date,
    day,
    hour,
    minute,
  }
})
