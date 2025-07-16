// MenderOnboardingScreen.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseApp from './firebase';

import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignUpScreen';
import ClientHomeScreen from './ClientHomeScreen';
import ContractorHomeScreen from './ContractorHomeScreen';
import AdminHomeScreen from './AdminHomeScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import StartJobScreen from './StartJobScreen';
import CompleteJobScreen from './CompleteJobScreen';
import IncompleteJobScreen from './IncompleteJobScreen';
import ClientJobsScreen from './ClientJobScreen';
import ClientJobDetailsScreen from './ClientJobDetailsScreen';
import ContractorAvailabilityScreen from './ContractorAvailabilityScreen';
import ContractorEarningsScreen from './ContractorEarningsScreen';
import ContractorProfileScreen from './ContractorProfileScreen';
import ContractorMapViewScreen from './ContractorMapViewScreen';
import ContractorListViewScreen from './ContractorListViewScreen';
import ContractorCardViewScreen from './ContractorCardViewScreen';
import AdminUserManagementScreen from './AdminUserManagementScreen';
import AdminJobControlScreen from './AdminJobControlScreen';
import AdminSettingsScreen from './AdminSettingsScreen';
import RateClientScreen from './RateClientScreen';
import RateContractorScreen from './RateContractorScreen';
import ReviewHistoryScreen from './ReviewHistoryScreen';
import PaymentSetupScreen from './PaymentSetupScreen';
import PaymentHistoryScreen from './PaymentHistoryScreen';
import InvoiceScreen from './InvoiceScreen';
import ApplyContractorScreen from './ApplyContractorScreen';
import ContactUsScreen from './ContactUsScreen';
import SettingsScreen from './SettingsScreen';
import MaintenanceTipsScreen from './MaintenanceTipsScreen';
import HowToVideosScreen from './HowToVideosScreen';
import ContractorAdSubmissionScreen from './ContractorAdSubmissionScreen';
import LegalMediaReleaseScreen from './LegalMediaReleaseScreen';
import HelpSupportScreen from './HelpSupportScreen';
import WelcomeBackScreen from './WelcomeBackScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// 🧭 Role-Based Drawer Navigators

function ClientDrawer() {
  return (
    <Drawer.Navigator initialRouteName="ClientHome">
      <Drawer.Screen name="ClientHome" component={ClientHomeScreen} />
      <Drawer.Screen name="Post Job" component={PostJobScreen} />
      <Drawer.Screen name="Client Jobs" component={ClientJobsScreen} />
      <Drawer.Screen name="Maintenance Tips" component={MaintenanceTipsScreen} />
      <Drawer.Screen name="How-To Videos" component={HowToVideosScreen} />
      <Drawer.Screen name="Invoice" component={InvoiceScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

function ContractorDrawer() {
  return (
    <Drawer.Navigator initialRouteName="ContractorHome">
      <Drawer.Screen name="ContractorHome" component={ContractorHomeScreen} />
      <Drawer.Screen name="Open Jobs" component={OpenJobsScreen} />
      <Drawer.Screen name="Earnings" component={ContractorEarningsScreen} />
      <Drawer.Screen name="Availability" component={ContractorAvailabilityScreen} />
      <Drawer.Screen name="Profile" component={ContractorProfileScreen} />
      <Drawer.Screen name="Map View" component={ContractorMapViewScreen} />
      <Drawer.Screen name="List View" component={ContractorListViewScreen} />
      <Drawer.Screen name="Card View" component={ContractorCardViewScreen} />
      <Drawer.Screen name="Submit Ad" component={ContractorAdSubmissionScreen} />
      <Drawer.Screen name="Media Release" component={LegalMediaReleaseScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

function AdminDrawer() {
  return (
    <Drawer.Navigator initialRouteName="AdminHome">
      <Drawer.Screen name="AdminHome" component={AdminHomeScreen} />
      <Drawer.Screen name="User Management" component={AdminUserManagementScreen} />
      <Drawer.Screen name="Job Control" component={AdminJobControlScreen} />
      <Drawer.Screen name="Admin Settings" component={AdminSettingsScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
    </Drawer.Navigator>
  );
}

// 🚀 Main App Navigator

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

  // 🧠 Show splash while checking
  if (checkingAuth || !initialRoute) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      {/* Auth & Intro Screens */}
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="WelcomeBackScreen" component={WelcomeBackScreen} />
      <Stack.Screen name="ApplyContractorScreen" component={ApplyContractorScreen} />

      {/* Drawer Navigators */}
      <Stack.Screen name="ClientDrawer" component={ClientDrawer} />
      <Stack.Screen name="ContractorDrawer" component={ContractorDrawer} />
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />

      {/* Job Screens */}
      <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
      <Stack.Screen name="StartJobScreen" component={StartJobScreen} />
      <Stack.Screen name="CompleteJobScreen" component={CompleteJobScreen} />
      <Stack.Screen name="IncompleteJobScreen" component={IncompleteJobScreen} />
      <Stack.Screen name="ClientJobDetailsScreen" component={ClientJobDetailsScreen} />

      {/* Reviews & Payments */}
      <Stack.Screen name="RateClientScreen" component={RateClientScreen} />
      <Stack.Screen name="RateContractorScreen" component={RateContractorScreen} />
      <Stack.Screen name="ReviewHistoryScreen" component={ReviewHistoryScreen} />
      <Stack.Screen name="PaymentSetupScreen" component={PaymentSetupScreen} />
      <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} />
    </Stack.Navigator>
  );
}
