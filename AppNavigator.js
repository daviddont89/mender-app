// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MenderOnboardingScreens from './MenderOnboardingScreens';
import AppNavigator from './AppNavigator';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase'; // adjust path to your firebase config

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // optionally show splash

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <MenderOnboardingScreens />}
    </NavigationContainer>
  );
}
