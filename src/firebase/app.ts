import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import admin from "firebase-admin";

const firebaseConfig = {
  apiKey: "AIzaSyAFU56TOvCBxW8jgnVIqXL9WgjBYsyAD34",
  authDomain: "rochyrd-music.firebaseapp.com",
  projectId: "rochyrd-music",
  storageBucket: "rochyrd-music.appspot.com",
  messagingSenderId: "837540164812",
  appId: "1:837540164812:web:62fead8cf8dad5278f7e69",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export function initFbAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const privateKey = process.env.FIREBASE_SERVICE_PRIVATE_KEY!.replace(
    /\\n/g,
    "\n",
  );

  return admin.initializeApp({
    projectId: firebaseConfig.projectId,
    credential: privateKey === null
      ? admin.credential.applicationDefault()
      : admin.credential.cert(
        {
          projectId: firebaseConfig.projectId,
          privateKey,
          clientEmail: process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
        },
      ),
    storageBucket: "rochyrd-music.appspot.com",
  });
}
