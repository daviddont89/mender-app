// DrawerNavigator.js
import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';
import SettingsScreen from './SettingsScreen';
import AdminScreen from './AdminScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        } else {
          setUserRole('client'); // default
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const renderHome = () => {
    if (userRole === 'contractor') return ContractorHomeScreen;
    return ClientHomeScreen;
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#008080' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#008080',
      }}
    >
      <Drawer.Screen name="Home" component={renderHome()} />
      <Drawer.Screen name="Post a Job" component={PostJobScreen} />
      <Drawer.Screen name="Open Jobs" component={OpenJobsScreen} />
      <Drawer.Screen name="Job Details" component={JobDetailsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
      {userRole === 'admin' && (
        <Drawer.Screen name="Admin Role Manager" component={AdminScreen} />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
