// App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingNavigator from './MenderOnboardingScreens';
import MainAppNavigator from './MainAppNavigator';
import { auth } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <MainAppNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}
