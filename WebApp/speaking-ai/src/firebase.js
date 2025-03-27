// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ31DinP2LXCkRxwNtKkNzedlayMPWut8",
  authDomain: "speaking-with-ai.firebaseapp.com",
  projectId: "speaking-with-ai",
  storageBucket: "speaking-with-ai.firebasestorage.app",
  messagingSenderId: "352091870349",
  appId: "1:352091870349:web:653450b48aec71879bfec4",
  measurementId: "G-LJ9CTFGHBB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
