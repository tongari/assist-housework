import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sendGrid from '@sendgrid/mail'

admin.initializeApp()

exports.makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    const originalData = snap.data().original
    functions.logger.log('Uppercasing', context.params.documentId, originalData)
    const uppercase = originalData.toUpperCase()
    return snap.ref.set({ uppercase }, { merge: true })
  })

exports.addMessage = functions.https.onCall(async (data) => {
  const original = data.text
  const writeResult = await admin
    .firestore()
    .collection('messages')
    .add({ original })

  return {
    result: `Message with ID: ${writeResult.id} added.`,
  }
})

// TODO: テストコードのため後で最適化
export const sendMail = functions.https.onRequest(async (_, response) => {
  const apiKey = functions.config().send_grid.key
  const fromAddress = functions.config().send_grid.from_address
  sendGrid.setApiKey(apiKey)
  const msg = {
    to: '',
    from: fromAddress,
    subject: 'assistant-work-try-mail',
    text: 'Try assistant work mail.',
  }
  const result = await sendGrid.send(msg)
  functions.logger.info('sendMail', result)
  response.send('complete')
})
