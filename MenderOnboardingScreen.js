// MenderOnboardingScreen.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseApp from './firebase';

// Auth & Intro
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignUpScreen';
import WelcomeBackScreen from './WelcomeBackScreen';
import ApplyContractorScreen from './ApplyContractorScreen';

// Drawer Navigators (NEW)
import ClientDrawerNavigator from './ClientDrawerNavigator';
import ContractorDrawerNavigator from './ContractorDrawerNavigator';
import AdminDrawerNavigator from './AdminDrawerNavigator';

// Job Details & Core Screens
import JobDetailsScreen from './JobDetailsScreen';
import StartJobScreen from './StartJobScreen';
import CompleteJobScreen from './CompleteJobScreen';
import IncompleteJobScreen from './IncompleteJobScreen';
import ClientJobDetailsScreen from './ClientJobDetailsScreen';

// Reviews & Payments
import RateClientScreen from './RateClientScreen';
import RateContractorScreen from './RateContractorScreen';
import ReviewHistoryScreen from './ReviewHistoryScreen';
import PaymentSetupScreen from './PaymentSetupScreen';
import PaymentHistoryScreen from './PaymentHistoryScreen';

// Advertising
import AdminAdControlScreen from './AdminAdControlScreen';
import AdminPackageBuilderScreen from './AdminPackageBuilderScreen';
import ClientSubscriptionScreen from './ClientSubscriptionScreen';


const Stack = createStackNavigator();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default function MenderOnboardingScreen() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const role = userSnap.data().role;
          if (role === 'contractor') setInitialRoute('ContractorDrawer');
          else if (role === 'client') setInitialRoute('ClientDrawer');
          else if (role === 'admin') setInitialRoute('AdminDrawer');
        } else {
          setInitialRoute('OnboardingScreen');
        }
        setCheckingAuth(false);
      } else {
        // Show splash for 2.5 seconds then go to onboarding
        setInitialRoute('SplashScreen');
        setTimeout(() => {
          setInitialRoute('OnboardingScreen');
          setCheckingAuth(false);
        }, 2500);
      }
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth || !initialRoute) return <SplashScreen />;

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      {/* Auth & Intro */}
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="WelcomeBackScreen" component={WelcomeBackScreen} />
      <Stack.Screen name="ApplyContractorScreen" component={ApplyContractorScreen} />

      {/* Role Navigators */}
      <Stack.Screen name="ClientDrawer" component={ClientDrawerNavigator} />
      <Stack.Screen name="ContractorDrawer" component={ContractorDrawerNavigator} />
      <Stack.Screen name="AdminDrawer" component={AdminDrawerNavigator} />

      {/* Job Screens */}
      <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
      <Stack.Screen name="StartJobScreen" component={StartJobScreen} />
      <Stack.Screen name="CompleteJobScreen" component={CompleteJobScreen} />
      <Stack.Screen name="IncompleteJobScreen" component={IncompleteJobScreen} />
      <Stack.Screen name="ClientJobDetailsScreen" component={ClientJobDetailsScreen} />

      {/* Ratings & Payments */}
      <Stack.Screen name="RateClientScreen" component={RateClientScreen} />
      <Stack.Screen name="RateContractorScreen" component={RateContractorScreen} />
      <Stack.Screen name="ReviewHistoryScreen" component={ReviewHistoryScreen} />
      <Stack.Screen name="PaymentSetupScreen" component={PaymentSetupScreen} />
      <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} />

    
      {/* Advertising */}
      <Stack.Screen name="AdminPackageBuilderScreen" component={AdminPackageBuilderScreen} />
      <Stack.Screen name="AdminAdControlScreen" component={AdminAdControlScreen} />
      <Stack.Screen name="ClientSubscriptionScreen" component={ClientSubscriptionScreen} />
      </Stack.Navigator>

  );
}
