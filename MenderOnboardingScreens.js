import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';

const Stack = createStackNavigator();

export default function MenderOnboardingScreen() {
  return (
    <Stack.Navigator initialRouteName="Screen1">
      <Stack.Screen name="Screen1" component={Screen1} options={{ headerShown: false }} />
      <Stack.Screen name="Screen2" component={Screen2} options={{ headerShown: false }} />
      <Stack.Screen name="Screen3" component={Screen3} options={{ headerShown: false }} />
      <Stack.Screen name="Screen4" component={Screen4} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PostJob" component={PostJobScreen} />
      <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    </Stack.Navigator>
  );
}
