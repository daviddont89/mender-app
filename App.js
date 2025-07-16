// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth & Entry Screens
import SplashScreen from './SplashScreen';
import MenderOnboardingScreen from './MenderOnboardingScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

// Role-Based Drawer Navigators (name must match onboarding)
import ClientDrawerNavigator from './ClientDrawerNavigator';
import ContractorDrawerNavigator from './ContractorDrawerNavigator';
import AdminDrawerNavigator from './AdminDrawerNavigator';

// Other Shared Screens
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import ContractorOnboardingScreen from './ContractorOnboardingScreen';
import EditJobScreen from './EditJobScreen';
import JobReviewScreen from './JobReviewScreen';
import CompleteJobScreen from './CompleteJobScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
        {/* Auth Flow */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="MenderOnboardingScreen" component={MenderOnboardingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

        {/* Role-Based Drawers — match names used in onboarding */}
        <Stack.Screen name="ClientHomeScreen" component={ClientDrawerNavigator} />
        <Stack.Screen name="ContractorHomeScreen" component={ContractorDrawerNavigator} />
        <Stack.Screen name="AdminHomeScreen" component={AdminDrawerNavigator} />

        {/* Shared screens */}
        <Stack.Screen name="PostJobScreen" component={PostJobScreen} />
        <Stack.Screen name="OpenJobsScreen" component={OpenJobsScreen} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
        <Stack.Screen name="ContractorOnboardingScreen" component={ContractorOnboardingScreen} />
        <Stack.Screen name="EditJobScreen" component={EditJobScreen} />
        <Stack.Screen name="JobReviewScreen" component={JobReviewScreen} />
        <Stack.Screen name="CompleteJobScreen" component={CompleteJobScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
