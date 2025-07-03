// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAG_sO6vnMnkaccHstDYPspFsLzVq29THg",
  authDomain: "menderapp-8ddf3.firebaseapp.com",
  projectId: "menderapp-8ddf3",
  storageBucket: "menderapp-8ddf3.appspot.com",
  messagingSenderId: "547432694662",
  appId: "1:547432694662:web:367a8fd30aa00467f02207",
  measurementId: "G-8VKTE7DCVW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };