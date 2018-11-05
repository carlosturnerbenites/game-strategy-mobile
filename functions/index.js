const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// https://REGION-PROJECT.cloudfunctions.net/FUNCTION_NAME
// https://us-central1-PROJECT.cloudfunctions.net/helloWorld
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.updatePlayer = functions.firestore
  .document('players/{playerId}')
  .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

    // access a particular field as you would any JS property

    if (newValue.ready !== previousValue.ready) {
      // perform desired operations ...
      /*
      firestore
        .collection('rooms')
        .doc(newValue.room)
        .set(
          {n: Math.random()},
          {merge: true}
        )
      */

      firestore
        .collection('players')
        .where('room', '==', newValue.room)
        // .onSnapshot(querySnapshot => {
        .get()
        .then(querySnapshot => {
          var players = []
          querySnapshot.forEach(doc => {
            let data = doc.data()
            data.id = doc.id
            players.push(data)
          })
          ready = players.every(player => player.ready)

          return firestore
            .collection('config')
            .doc('default')
            .get()
            .then(doc => {
              let config = doc.data()
              console.log('config', config)
              let dataBoard = {
                height: config.heightBoard,
                width: config.widthBoard,
                time: config.gameTime
              }
              if (ready) {
                return firestore.collection('boards').add(dataBoard)
                  .then(ref => {
                    return firestore
                      .collection('rooms')
                      .doc(newValue.room)
                      .set({ ready, board: ref.id }, { merge: true })
                      .catch(err => { console.log(err) })
                  })
                  .catch(err => { console.log(err) })
              }
              return firestore
                .collection('rooms')
                .doc(newValue.room)
                .set({ ready }, { merge: true })
            }).catch(err => { console.log(err) })
        }).catch(err => { console.log(err) })
    }
  });
