// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Firebase configuration object (hardcoded inline, NOT imported)
const firebaseConfig = {
  apiKey: "AIzaSyBml...",
  authDomain: "mender-app.firebaseapp.com",
  projectId: "mender-app",
  storageBucket: "mender-app.appspot.com",
  messagingSenderId: "531863643493",
  appId: "1:531863643493:web:fc3a641e114bdfd44a5f3b",
  measurementId: "G-QVNLJZBBNF"
};

// ✅ Make sure initializeApp gets the config
const app = initializeApp(firebaseConfig);

// ✅ Initialize and export Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
