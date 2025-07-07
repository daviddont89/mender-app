// 🔒 LOCKED FILE — DO NOT EDIT, FIX, OR REPLACE
// AppNavigator.js

import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';

import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import AdminDashboardScreen from './AdminDashboardScreen';

import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import MyJobsScreen from './MyJobsScreen';
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';

const Drawer = createDrawerNavigator();

function ContractorDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Contractor Home" component={ContractorHomeScreen} />
      <Drawer.Screen name="Open Jobs" component={OpenJobsScreen} />
      <Drawer.Screen name="My Jobs" component={MyJobsScreen} />
      <Drawer.Screen name="Job Details" component={JobDetailsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
    </Drawer.Navigator>
  );
}

function ClientDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Client Home" component={ClientHomeScreen} />
      <Drawer.Screen name="Post a Job" component={PostJobScreen} />
      <Drawer.Screen name="My Jobs" component={MyJobsScreen} />
      <Drawer.Screen name="Job Details" component={JobDetailsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
    </Drawer.Navigator>
  );
}

function AdminDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
      <Drawer.Screen name="Job Details" component={JobDetailsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { userRole } = useContext(AuthContext);

  if (userRole === 'contractor') {
    return <ContractorDrawer />;
  } else if (userRole === 'client') {
    return <ClientDrawer />;
  } else if (userRole === 'admin') {
    return <AdminDrawer />;
  } else {
    return null; // Or loading screen/fallback
  }
}
