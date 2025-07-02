import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './HomeScreen';
import PostJobScreen from './PostJobScreen';
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="MainHome"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Drawer.Screen name="MainHome" component={HomeScreen} options={{ title: 'Home' }} />
        <Drawer.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Jobs' }} />
        <Drawer.Screen name="Account" component={AccountScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
        <Drawer.Screen name="JobDetails" component={JobDetailsScreen} />
        <Drawer.Screen name="MyJobsScreen" component={MyJobsScreen} />
        <Drawer.Screen name="OpenJobsScreen" component={OpenJobsScreen} />
        <Drawer.Screen name="MyJobsScreen" component={MyJobsScreen} />
        </Drawer.Navigator>
    </NavigationContainer>
  );
}
