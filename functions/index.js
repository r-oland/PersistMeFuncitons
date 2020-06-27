const functions = require("firebase-functions");
var admin = require("firebase-admin");

// const key = require("../key.json");
// admin.initializeApp({
//   credential: admin.credential.cert(key),
//   databaseURL: "https://persistme-d937f.firebaseio.com",
// });
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
