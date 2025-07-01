// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ActivityIndicator } from 'react-native';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  if (checking) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
