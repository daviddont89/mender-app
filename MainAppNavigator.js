// MainAppNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import AdminHomeScreen from './AdminHomeScreen';
import JobDetailsScreen from './JobDetailsScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import ApplyContractorScreen from './ApplyContractorScreen';
import ReviewClientScreen from './ReviewClientScreen';
import ReviewContractorScreen from './ReviewContractorScreen';
import MyJobsScreen from './MyJobsScreen';
import MetricsScreen from './MetricsScreen';
import PaymentOptionsScreen from './PaymentOptionsScreen';
import PaymentHistoryScreen from './PaymentHistoryScreen';
import SettingsScreen from './SettingsScreen';
import ContactUsScreen from './ContactUsScreen';
import RoleRedirectScreen from './RoleRedirectScreen';
import useUserRole from './useUserRole';

const Stack = createNativeStackNavigator();

export default function MainAppNavigator() {
  const { role } = useUserRole();

  // Choose base screen by role
  const getInitialScreen = () => {
    if (role === 'client') return ClientHomeScreen;
    if (role === 'contractor') return ContractorHomeScreen;
    if (role === 'admin') return AdminHomeScreen;
    return RoleRedirectScreen; // default fallback while role is loading
  };

  const InitialScreen = getInitialScreen();

  return (
    <Stack.Navigator initialRouteName="InitialScreen">
      <Stack.Screen name="InitialScreen" component={InitialScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClientHomeScreen" component={ClientHomeScreen} options={{ title: 'Client Home' }} />
      <Stack.Screen name="ContractorHomeScreen" component={ContractorHomeScreen} options={{ title: 'Contractor Home' }} />
      <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} options={{ title: 'Admin Home' }} />
      <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
      <Stack.Screen name="PostJobScreen" component={PostJobScreen} options={{ title: 'Post a Job' }} />
      <Stack.Screen name="OpenJobsScreen" component={OpenJobsScreen} options={{ title: 'Available Jobs' }} />
      <Stack.Screen name="ApplyContractorScreen" component={ApplyContractorScreen} options={{ title: 'Apply as Contractor' }} />
      <Stack.Screen name="ReviewClientScreen" component={ReviewClientScreen} options={{ title: 'Review Client' }} />
      <Stack.Screen name="ReviewContractorScreen" component={ReviewContractorScreen} options={{ title: 'Review Contractor' }} />
      <Stack.Screen name="MyJobsScreen" component={MyJobsScreen} options={{ title: 'My Jobs' }} />
      <Stack.Screen name="MetricsScreen" component={MetricsScreen} options={{ title: 'Metrics' }} />
      <Stack.Screen name="PaymentOptionsScreen" component={PaymentOptionsScreen} options={{ title: 'Payment Options' }} />
      <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ title: 'Contact Us' }} />
    </Stack.Navigator>
  );
}
