import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBW2jCTSRzaaiMr-NTJqnC676hwfWjjiFE",
  authDomain: "mymosque-c2f28.firebaseapp.com",
  projectId: "mymosque-c2f28",
  storageBucket: "mymosque-c2f28.appspot.com",
  messagingSenderId: "976505950197",
  appId: "1:976505950197:web:527dfa7295ed1cb3ae9abc",
  measurementId: "G-K4GC401XDH"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);