import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AdminScreen from './AdminScreen'; // User Management
import AdminJobsScreen from './AdminJobsScreen';
import AdminReviewsScreen from './AdminReviewsScreen';
import AdminSettingsScreen from './AdminSettingsScreen';
import AdminLogsScreen from './AdminLogsScreen';

const Tab = createMaterialTopTabNavigator();

export default function AdminDashboardScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: '#f2f2f2' },
      }}
    >
      <Tab.Screen name="Users" component={AdminScreen} />
      <Tab.Screen name="Jobs" component={AdminJobsScreen} />
      <Tab.Screen name="Reviews" component={AdminReviewsScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
      <Tab.Screen name="Logs" component={AdminLogsScreen} />
    </Tab.Navigator>
  );
}
