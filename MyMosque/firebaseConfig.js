// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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