import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';
import { ActivityIndicator, View } from 'react-native';

// Shared
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';
import SettingsScreen from './SettingsScreen';
import JobDetailsScreen from './JobDetailsScreen';

// Contractor
import ContractorHomeScreen from './ContractorHomeScreen';
import OpenJobsScreen from './OpenJobsScreen';
import MyJobsScreen from './MyJobsScreen';

// Client
import ClientHomeScreen from './ClientHomeScreen';
import PostJobScreen from './PostJobScreen';

// Admin
import AdminDashboardScreen from './AdminDashboardScreen';
import AdminUserManagementScreen from './AdminUserManagementScreen';
import AdminJobControlScreen from './AdminJobControlScreen';
import AdminPaymentsScreen from './AdminPaymentsScreen';

const Drawer = createDrawerNavigator();

function ContractorDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Contractor Home" component={ContractorHomeScreen} />
      <Drawer.Screen name="Open Jobs" component={OpenJobsScreen} />
      <Drawer.Screen name="My Jobs" component={MyJobsScreen} />
      <Drawer.Screen name="Job Details" component={JobDetailsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
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
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
    </Drawer.Navigator>
  );
}

function AdminDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
      <Drawer.Screen name="Manage Users" component={AdminUserManagementScreen} />
      <Drawer.Screen name="Job Controls" component={AdminJobControlScreen} />
      <Drawer.Screen name="Payments" component={AdminPaymentsScreen} />
      <Drawer.Screen name="Job Details" component={JobDetailsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { role } = useContext(AuthContext);

  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BFA6" />
      </View>
    );
  }

  if (role === 'contractor') return <ContractorDrawer />;
  if (role === 'client') return <ClientDrawer />;
  if (role === 'admin') return <AdminDrawer />;
  return null;
}
