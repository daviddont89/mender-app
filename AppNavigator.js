// AppNavigator.js
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function ClientDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="ClientHome" component={ClientHomeScreen} />
      <Drawer.Screen name="PostJob" component={PostJobScreen} />
      <Drawer.Screen name="OpenJobs" component={OpenJobsScreen} />
    </Drawer.Navigator>
  );
}

function ContractorDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="ContractorHome" component={ContractorHomeScreen} />
      <Drawer.Screen name="OpenJobs" component={OpenJobsScreen} />
    </Drawer.Navigator>
  );
}

function AdminDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="AdminHome" component={AdminHomeScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : role === 'contractor' ? (
        <Stack.Screen name="Contractor" component={ContractorDrawer} />
      ) : role === 'admin' ? (
        <Stack.Screen name="Admin" component={AdminDrawer} />
      ) : (
        <Stack.Screen name="Client" component={ClientDrawer} />
      )}
    </Stack.Navigator>
  );
}
