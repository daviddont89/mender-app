// firebase.js

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {
  initializeFirestore,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAG_sO6vnMnkaccHstDYPspFsLzVq29THg",
  authDomain: "menderapp-8ddf3.firebaseapp.com",
  projectId: "menderapp-8ddf3",
  storageBucket: "menderapp-8ddf3.appspot.com",
  messagingSenderId: "547432694662",
  appId: "1:547432694662:web:367a8fd30aa00467f02207",
  measurementId: "G-8VKTE7DCVW"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  console.error("🔥 Firebase failed to initialize:", err);
}

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  auth = getAuth(app);
}

// ✅ Strict Firestore fallback for Expo
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: true, // ✅ this forces Expo to use fetch instead of WebSocket
});

const storage = getStorage(app);

export { auth, db, storage };
