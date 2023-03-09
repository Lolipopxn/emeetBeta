// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPPurnapXdSbllfARcIds9JlgC4Uayl7M",
  authDomain: "emeetfes.firebaseapp.com",
  databaseURL: "https://emeetfes-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "emeetfes",
  storageBucket: "emeetfes.appspot.com",
  messagingSenderId: "632905686306",
  appId: "1:632905686306:web:79482c59e442e6f3d0597b",
  measurementId: "G-L0160MBSJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

export const storage = getStorage();