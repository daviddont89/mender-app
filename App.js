// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase';

// Splash Onboarding Flow
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';

// Auth
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

// Role Detection Router
import HomeRouterScreen from './HomeRouterScreen';

// Home Screens by Role
import ContractorHomeScreen from './ContractorHomeScreen';
import ClientHomeScreen from './ClientHomeScreen';
import AdminHomeScreen from './AdminHomeScreen';

// Job Screens
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import MyJobsScreen from './MyJobsScreen';

// Other Screens
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';
import SettingsScreen from './SettingsScreen';
import AdminScreen from './AdminScreen';
import AdminUserListScreen from './AdminUserListScreen';

// Initialize Firebase
initializeApp(firebaseConfig);
getAuth();
getFirestore();

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1" screenOptions={{ headerShown: false }}>
        {/* Splash Onboarding Screens */}
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
        <Stack.Screen name="Screen3" component={Screen3} />
        <Stack.Screen name="Screen4" component={Screen4} />

        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />

        {/* Role Router */}
        <Stack.Screen name="Home" component={HomeRouterScreen} />

        {/* Role-Based Home Screens */}
        <Stack.Screen name="ContractorHome" component={ContractorHomeScreen} />
        <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />

        {/* Job Functionality */}
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="MyJobs" component={MyJobsScreen} />

        {/* Misc */}
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="AdminUserList" component={AdminUserListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
