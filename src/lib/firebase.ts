import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCXEjxffKzWVDWrbQi8CfSmr9TZC7uwE_k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "daily-wellness-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "daily-wellness-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "daily-wellness-hub.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "721493695935",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:721493695935:web:78c3f5e01d7f1bb0d2150a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-M1XLS20TC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
export const logout = () => signOut(auth);

export { app, analytics, db, auth };
