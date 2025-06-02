// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv5ipir0BGX42WZXWZrnictMClaJ5FVao",
  authDomain: "openlab-dd1fc.firebaseapp.com",
  projectId: "openlab-dd1fc",
  storageBucket: "openlab-dd1fc.firebasestorage.app",
  messagingSenderId: "888456062103",
  appId: "1:888456062103:web:6f37fd8558cf9c433035d2"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export const auth = getAuth(appFirebase);
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase);
export default appFirebase;
