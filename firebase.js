// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAG_sO6vnMnkaccHstDYPspFsLzVq29THg",
  authDomain: "menderapp-8ddf3.firebaseapp.com",
  projectId: "menderapp-8ddf3",
  storageBucket: "menderapp-8ddf3.appspot.com",
  messagingSenderId: "547432694662",
  appId: "1:547432694662:web:367a8fd30aa00467f02207",
  measurementId: "G-8VKTE7DCVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Export for use in other screens
export { db, auth };
