// MenderOnboardingScreen.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from './firebase';

import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignUpScreen';
import WelcomeBackScreen from './WelcomeBackScreen';
import ApplyContractorScreen from './ApplyContractorScreen';

import JobDetailsScreen from './JobDetailsScreen';
import StartJobScreen from './StartJobScreen';
import CompleteJobScreen from './CompleteJobScreen';
import IncompleteJobScreen from './IncompleteJobScreen';
import ClientJobDetailsScreen from './ClientJobDetailsScreen';

import RateClientScreen from './RateClientScreen';
import RateContractorScreen from './RateContractorScreen';
import ReviewHistoryScreen from './ReviewHistoryScreen';
import PaymentSetupScreen from './PaymentSetupScreen';
import PaymentHistoryScreen from './PaymentHistoryScreen';
import InvoiceScreen from './InvoiceScreen';

import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();
const auth = getAuth(firebaseApp);

export default function MenderOnboardingScreen() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="WelcomeBackScreen" component={WelcomeBackScreen} />
          <Stack.Screen name="ApplyContractorScreen" component={ApplyContractorScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainApp" component={DrawerNavigator} />
          <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
          <Stack.Screen name="StartJobScreen" component={StartJobScreen} />
          <Stack.Screen name="CompleteJobScreen" component={CompleteJobScreen} />
          <Stack.Screen name="IncompleteJobScreen" component={IncompleteJobScreen} />
          <Stack.Screen name="ClientJobDetailsScreen" component={ClientJobDetailsScreen} />
          <Stack.Screen name="RateClientScreen" component={RateClientScreen} />
          <Stack.Screen name="RateContractorScreen" component={RateContractorScreen} />
          <Stack.Screen name="ReviewHistoryScreen" component={ReviewHistoryScreen} />
          <Stack.Screen name="PaymentSetupScreen" component={PaymentSetupScreen} />
          <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} />
          <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
