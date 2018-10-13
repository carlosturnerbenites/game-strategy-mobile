const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// https://REGION-PROJECT.cloudfunctions.net/FUNCTION_NAME
// https://us-central1-PROJECT.cloudfunctions.net/helloWorld
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
