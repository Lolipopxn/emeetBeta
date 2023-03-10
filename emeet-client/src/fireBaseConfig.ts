// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6NNeluZetN9RZaULxdwRLGh-KOJrUVA0",
  authDomain: "emeetfes-553a8.firebaseapp.com",
  databaseURL: "https://emeetfes-553a8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "emeetfes-553a8",
  storageBucket: "emeetfes-553a8.appspot.com",
  messagingSenderId: "580497298910",
  appId: "1:580497298910:web:d974ba7d678d659afcb94f",
  measurementId: "G-QD8DS3CYBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

export const storage = getStorage();