// DrawerNavigator.js
import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Home Screens
import ClientHomeScreen from './ClientHomeScreen';
import ContractorHomeScreen from './ContractorHomeScreen';
import AdminHomeScreen from './AdminHomeScreen';

// Client Drawer Screens
import PostJobScreen from './PostJobScreen';
import ClientJobsScreen from './ClientJobScreen';
import MaintenanceTipsScreen from './MaintenanceTipsScreen';
import HowToVideosScreen from './HowToVideosScreen';
import InvoiceScreen from './InvoiceScreen';

// Contractor Drawer Screens
import OpenJobsScreen from './OpenJobsScreen';
import ContractorEarningsScreen from './ContractorEarningsScreen';
import ContractorAvailabilityScreen from './ContractorAvailabilityScreen';
import ContractorProfileScreen from './ContractorProfileScreen';
import ContractorMapViewScreen from './ContractorMapViewScreen';
import ContractorListViewScreen from './ContractorListViewScreen';
import ContractorCardViewScreen from './ContractorCardViewScreen';
import ContractorAdSubmissionScreen from './ContractorAdSubmissionScreen';
import LegalMediaReleaseScreen from './LegalMediaReleaseScreen';

// Admin Drawer Screens
import AdminUserManagementScreen from './AdminUserManagementScreen';
import AdminJobControlScreen from './AdminJobControlScreen';
import AdminSettingsScreen from './AdminSettingsScreen';

// Common Screens
import AccountScreen from './AccountScreen';
import SettingsScreen from './SettingsScreen';
import ContactUsScreen from './ContactUsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        setUserRole(userSnap.exists() ? userSnap.data().role : 'client');
      } else {
        setUserRole('client');
      }
    });
    return () => unsubscribe();
  }, []);

  // Loading indicator while determining user role
  if (userRole === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#008080' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#008080',
      }}
    >
      {/* Home Screens with Explicit Drawer Label */}
      {userRole === 'client' && (
        <Drawer.Screen name="Home" component={ClientHomeScreen} options={{drawerLabel: 'Client Home'}} />
      )}
      {userRole === 'contractor' && (
        <Drawer.Screen name="Home" component={ContractorHomeScreen} options={{drawerLabel: 'Contractor Home'}} />
      )}
      {userRole === 'admin' && (
        <Drawer.Screen name="Home" component={AdminHomeScreen} options={{drawerLabel: 'Admin Dashboard'}} />
      )}

      {/* Client Screens */}
      {userRole === 'client' && (
        <>
          <Drawer.Screen name="Post Job" component={PostJobScreen} />
          <Drawer.Screen name="Client Jobs" component={ClientJobsScreen} />
          <Drawer.Screen name="Maintenance Tips" component={MaintenanceTipsScreen} />
          <Drawer.Screen name="How-To Videos" component={HowToVideosScreen} />
          <Drawer.Screen name="Invoice" component={InvoiceScreen} />
        </>
      )}

      {/* Contractor Screens */}
      {userRole === 'contractor' && (
        <>
          <Drawer.Screen name="Open Jobs" component={OpenJobsScreen} />
          <Drawer.Screen name="Earnings" component={ContractorEarningsScreen} />
          <Drawer.Screen name="Availability" component={ContractorAvailabilityScreen} />
          <Drawer.Screen name="Profile" component={ContractorProfileScreen} />
          <Drawer.Screen name="Map View" component={ContractorMapViewScreen} />
          <Drawer.Screen name="List View" component={ContractorListViewScreen} />
          <Drawer.Screen name="Card View" component={ContractorCardViewScreen} />
          <Drawer.Screen name="Submit Ad" component={ContractorAdSubmissionScreen} />
          <Drawer.Screen name="Media Release" component={LegalMediaReleaseScreen} />
        </>
      )}

      {/* Admin Screens */}
      {userRole === 'admin' && (
        <>
          <Drawer.Screen name="User Management" component={AdminUserManagementScreen} />
          <Drawer.Screen name="Job Control" component={AdminJobControlScreen} />
          <Drawer.Screen name="Admin Settings" component={AdminSettingsScreen} />
        </>
      )}

      {/* Common Screens (Accessible by all roles) */}
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
