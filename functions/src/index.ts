import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { HttpsError } from 'firebase-functions/lib/providers/https'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { ja } from 'date-fns/locale'

import * as jwt from 'jsonwebtoken'
import { VerifyErrors } from 'jsonwebtoken'

const jwtKey = functions.config().jwt_key

admin.initializeApp()

const success = {
  message: 'success',
}

interface AddAssistantUserIdsProps {
  approverId: string
  inviteToken: string
}
exports.addAssistantUserIds = functions.https.onCall(
  async ({ approverId, inviteToken }: AddAssistantUserIdsProps, context) => {
    const assistantId = context.auth?.uid
    if (!approverId || !assistantId) {
      throw new HttpsError(
        'invalid-argument',
        '招待されたURLから登録してください'
      )
    }

    const approver = admin.firestore().collection('users').doc(approverId)
    const approverDoc = await approver.get()

    if (inviteToken !== approverDoc.get('currentWatchUser').inviteToken) {
      throw new HttpsError(
        'invalid-argument',
        '招待されたURLからログインしてください。'
      )
    }

    // tokenの検証
    jwt.verify(inviteToken, jwtKey, (err: VerifyErrors | null) => {
      if (err) {
        throw new HttpsError(
          'invalid-argument',
          'このURLは有効期限切です。招待された方から新しいURLを貰ってください。'
        )
      }
    })

    const approverRoleRef = await approverDoc.get('roleRef').get()
    // TODO: フロントと共通のenumを使うなどを考慮
    if (approverRoleRef.id !== '2') {
      throw new HttpsError(
        'invalid-argument',
        '招待URLを貰ったユーザの権限が不適切です。'
      )
    }

    const result = await approver.set(
      {
        currentWatchUser: {
          id: assistantId,
          inviteToken: null,
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

exports.getInviteOnetimeUrl = functions.https.onCall(async (_, context) => {
  const uid = context.auth?.uid
  if (!uid) {
    throw new HttpsError('invalid-argument', 'nothing uid')
  }

  const approver = admin.firestore().collection('users').doc(uid)
  const approverDoc = await approver.get()

  let token = approverDoc.get('currentWatchUser').inviteToken

  if (!token) {
    token = jwt.sign({ uid }, jwtKey, { expiresIn: '1d' })
    await approver.set(
      {
        currentWatchUser: {
          inviteToken: token,
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )
  }

  functions.logger.info('getInviteOnetimeUrl')

  return {
    host: context.rawRequest.headers.origin,
    uid,
    token,
  }
})
