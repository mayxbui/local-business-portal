// https://firebase.google.com/docs/web/setup#available-libraries
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDreXbR5gVlLL-pIMxib7opTgagVz39N5E",
  authDomain: "local-business-portal-c4339.firebaseapp.com",
  projectId: "local-business-portal-c4339",
  storageBucket: "local-business-portal-c4339.firebasestorage.app",
  messagingSenderId: "553450575331",
  appId: "1:553450575331:web:e7bb387618a6235f113cd6",
  measurementId: "G-CHL9XSMKMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db = getFirestore(app);

export default app;