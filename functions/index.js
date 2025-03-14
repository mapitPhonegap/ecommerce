const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.lowercaseProductName = functions.firestore.document('/products/{documentId}')
    .onCreate((snap, context) => {
        const name = snap.name;

        functions.logger.log('Lowercasing product name', context.params.documentId, name);

        const lowercaseName = name.toLowerCase();

        return snap.ref.set({ name: lowercaseName }, { merge: true });
    });

