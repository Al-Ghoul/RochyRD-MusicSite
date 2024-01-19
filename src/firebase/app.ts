import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFU56TOvCBxW8jgnVIqXL9WgjBYsyAD34",
  authDomain: "rochyrd-music.firebaseapp.com",
  projectId: "rochyrd-music",
  storageBucket: "rochyrd-music.appspot.com",
  messagingSenderId: "837540164812",
  appId: "1:837540164812:web:62fead8cf8dad5278f7e69",
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
}
