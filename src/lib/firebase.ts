import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwPhFnia9pvkeH8R-vU0P-M6e1RbpEpDg",
  authDomain: "games-933f2.firebaseapp.com",
  projectId: "games-933f2",
  storageBucket: "games-933f2.firebasestorage.app",
  messagingSenderId: "361418496567",
  appId: "1:361418496567:web:1afd8e085114d4daf97db2",
  measurementId: "G-MX9MFZF400",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
// Explicit bucket helps when default resolution fails
export const storage = getStorage(app, "gs://games-933f2.firebasestorage.app");
export default app;
