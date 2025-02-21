// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ31DinP2LXCkRxwNtKkNzedlayMPWut8",
  authDomain: "speaking-with-ai.firebaseapp.com",
  projectId: "speaking-with-ai",
  storageBucket: "speaking-with-ai.firebasestorage.app",
  messagingSenderId: "352091870349",
  appId: "1:352091870349:web:653450b48aec71879bfec4",
  measurementId: "G-LJ9CTFGHBB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
