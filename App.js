// App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignUpScreen';
import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import AccountScreen from './AccountScreen';
import SettingsScreen from './SettingsScreen';
import ContactScreen from './ContactScreen';
import AdminUserListScreen from './AdminUserListScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Screen1" component={Screen1} />
            <Stack.Screen name="Screen2" component={Screen2} />
            <Stack.Screen name="Screen3" component={Screen3} />
            <Stack.Screen name="Screen4" component={Screen4} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="ContractorHome" component={ContractorHomeScreen} />
            <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
            <Stack.Screen name="PostJob" component={PostJobScreen} />
            <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="AdminUserList" component={AdminUserListScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
