
// AdminDrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminDashboardScreen from './AdminDashboardScreen';
import AdminUserListScreen from './AdminUserListScreen';
import AdminJobsScreen from './AdminJobsScreen';
import AdminPaymentsScreen from './AdminPaymentsScreen';
import AdminReviewsScreen from './AdminReviewsScreen';
import ContactUsScreen from './ContactUsScreen';
import SettingsScreen from './SettingsScreen';
import AccountScreen from './AccountScreen';

const Drawer = createDrawerNavigator();

export default function AdminDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="AdminDashboardScreen">
      <Drawer.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="AdminUserListScreen" component={AdminUserListScreen} options={{ title: 'Users' }} />
      <Drawer.Screen name="AdminJobsScreen" component={AdminJobsScreen} options={{ title: 'Jobs' }} />
      <Drawer.Screen name="AdminPaymentsScreen" component={AdminPaymentsScreen} options={{ title: 'Payments' }} />
      <Drawer.Screen name="AdminReviewsScreen" component={AdminReviewsScreen} options={{ title: 'Reviews' }} />
      <Drawer.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ title: 'Contact Us' }} />
      <Drawer.Screen name="AccountScreen" component={AccountScreen} options={{ title: 'Account' }} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Drawer.Navigator>
  );
}
