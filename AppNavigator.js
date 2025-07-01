// AppNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import PostJobScreen from './PostJobScreen';
import MyJobsScreen from './MyJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PostJob" component={PostJobScreen} />
      <Stack.Screen name="MyJobs" component={MyJobsScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={MainStack} />
      <Drawer.Screen name="Post a Job" component={PostJobScreen} />
      <Drawer.Screen name="My Jobs" component={MyJobsScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Contact Us" component={ContactScreen} />
    </Drawer.Navigator>
  );
}
