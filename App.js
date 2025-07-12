// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// SCREENS (V1 Only)
import SplashScreen from './SplashScreen';
import MenderOnboardingScreen from './MenderOnboardingScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ClientHomeScreen from './ClientHomeScreen';
import ContractorHomeScreen from './ContractorHomeScreen';
import AdminHomeScreen from './AdminHomeScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import ContractorOnboardingScreen from './ContractorOnboardingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="MenderOnboardingScreen" component={MenderOnboardingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="ClientHomeScreen" component={ClientHomeScreen} />
        <Stack.Screen name="ContractorHomeScreen" component={ContractorHomeScreen} />
        <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
        <Stack.Screen name="PostJobScreen" component={PostJobScreen} />
        <Stack.Screen name="OpenJobsScreen" component={OpenJobsScreen} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
        <Stack.Screen name="ContractorOnboardingScreen" component={ContractorOnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
