const functions = require("firebase-functions");
var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://persistme-d937f.firebaseio.com",
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

exports.createUserDoc = functions.https.onCall(async (data, context) => {
  const { username, email } = data;

  try {
    const user = await admin
      .firestore()
      .collection("users")
      .doc(username)
      .get();

    if (!user.exists) {
      admin.firestore().collection("users").doc(username).set({
        userId: context.auth.uid,
        email,
        username,
        subscriptionDate: new Date(),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

exports.updateUserDoc = functions.https.onCall(async (data, context) => {
  const { uid, username, email } = data;

  console.log(data);

  try {
    const user = await admin
      .firestore()
      .collection("users")
      .where("userId", "==", uid)
      .get();

    if (user.exists) {
      admin.firestore().collection("users").doc(username).update({
        username,
        email,
      });
    }
  } catch (error) {
    console.log(error);
  }
});
