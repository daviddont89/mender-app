// DrawerNavigator.js
import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { onAuthStateChanged } from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';
import SettingsScreen from './SettingsScreen';
import AdminScreen from './AdminScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
    const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        } else {
          setUserRole('client'); // fallback default
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userRole) return null; // prevent rendering drawer before userRole is loaded

  const HomeComponent =
    userRole === 'contractor' ? ContractorHomeScreen : ClientHomeScreen;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#008080' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#008080',
      }}
    >
      <Drawer.Screen name="Home" component={HomeComponent} />
      <Drawer.Screen name="Post a Job" component={PostJobScreen} />
      <Drawer.Screen name="Open Jobs" component={OpenJobsScreen} />
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
