import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeRouterScreen from './HomeRouterScreen';
import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import AdminHomeScreen from './AdminHomeScreen';

import HomeScreen from './HomeScreen';
import PostJobScreen from './PostJobScreen';
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';
import JobDetailsScreen from './JobDetailsScreen';
import MyJobsScreen from './MyJobsScreen';
import OpenJobsScreen from './OpenJobsScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="HomeRouter" screenOptions={{ headerShown: true }}>
        <Drawer.Screen name="HomeRouter" component={HomeRouterScreen} options={{ title: 'Loading...' }} />
        <Drawer.Screen name="AdminHome" component={AdminHomeScreen} />
        <Drawer.Screen name="ClientHome" component={ClientHomeScreen} />
        <Drawer.Screen name="ContractorHome" component={ContractorHomeScreen} />
        <Drawer.Screen name="MainHome" component={HomeScreen} options={{ title: 'Home' }} />
        <Drawer.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Post a Job' }} />
        <Drawer.Screen name="Account" component={AccountScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
        <Drawer.Screen name="JobDetails" component={JobDetailsScreen} />
        <Drawer.Screen name="MyJobsScreen" component={MyJobsScreen} />
        <Drawer.Screen name="OpenJobsScreen" component={OpenJobsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
