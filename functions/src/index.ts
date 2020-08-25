import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

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
