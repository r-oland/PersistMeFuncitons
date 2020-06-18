const functions = require("firebase-functions");
var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://persistme-d937f.firebaseio.comm",
});

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const snapshot = await admin
    .firestore()
    .collection("users")
    .where("userId", "==", user.uid)
    .get();

  snapshot.forEach((doc) => {
    doc.ref.delete();
  });
});

exports.createUserDoc = functions.https.onCall(async (username, context) => {
  try {
    const user = await admin
      .firestore()
      .collection("users")
      .doc(username)
      .get();

    if (!user.exists) {
      admin.firestore().collection("users").doc(username).set({
        userId: context.auth.uid,
        username: username,
        subscriptionDate: new Date(),
      });
    }
  } catch (error) {
    console.log(error);
  }
});
