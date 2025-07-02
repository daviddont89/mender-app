// MainAppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import PostJobScreen from './PostJobScreen';
import JobDetailsScreen from './JobDetailsScreen';
import OpenJobsScreen from './OpenJobsScreen';
import MyJobsScreen from './MyJobsScreen';
import MenderSplashScreen from './MenderSplashScreen';

const Stack = createStackNavigator();

const MainAppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PostJob" component={PostJobScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
      <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
      <Stack.Screen name="MyJobs" component={MyJobsScreen} />
      <Stack.Screen name="Splash" component={MenderSplashScreen} />
    </Stack.Navigator>
  );
};

export default MainAppNavigator;
