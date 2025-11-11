import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.join(__dirname, "../../firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log("Firebase Admin initialized");
}

export const auth = admin.auth();
export default admin;
