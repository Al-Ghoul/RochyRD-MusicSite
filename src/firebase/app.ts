import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import admin from "firebase-admin";
import { connectStorageEmulator, getStorage } from "firebase/storage";

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
const auth = getAuth(app);
const storage = getStorage(app);

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectStorageEmulator(storage, "localhost", 9199);
}

export function initFbAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY!;

  return admin.initializeApp({
    projectId: "rochyrd-music",
    credential: serviceAccount === null
      ? admin.credential.applicationDefault()
      : admin.credential.cert(serviceAccount),
    storageBucket: "rochyrd-music.appspot.com",
  });
}
