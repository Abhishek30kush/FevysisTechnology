import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3IlZFzjZd_NeAUAwtkKWkC2onkuXj5n4",
  authDomain: "fevysis-technology.firebaseapp.com",
  projectId: "fevysis-technology",
  storageBucket: "fevysis-technology.firebasestorage.app",
  messagingSenderId: "685708144886",
  appId: "1:685708144886:web:447c15f628a6b55ec63cd7",
  measurementId: "G-RSCKR4V2LW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
