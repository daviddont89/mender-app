// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { createContext } from 'react'; // ✅ MISSING IMPORT FIXED

// ✅ Firebase configuration object (hardcoded inline, NOT imported)
const firebaseConfig = {
  apiKey: "AIzaSyAG_sO6vnMnkaccHstDYPspFsLzVq29THg",
  authDomain: "menderapp-8ddf3.firebaseapp.com",
  projectId: "menderapp-8ddf3",
  storageBucket: "menderapp-8ddf3.firebasestorage.app",
  messagingSenderId: "547432694662",
  appId: "1:547432694662:web:367a8fd30aa00467f02207",
  measurementId: "G-8VKTE7DCVW"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize and export Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export const AuthContext = createContext();

export { auth, firestore, storage };
