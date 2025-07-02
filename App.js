import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import MenderSplashScreen from './MenderSplashScreen';
import MenderOnboardingScreens from './MenderOnboardingScreens';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import JobDetailsScreen from './JobDetailsScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import MyJobsScreen from './MyJobsScreen';
import AccountScreen from './AccountScreen';
import ContactScreen from './ContactScreen';

// Additional Screens (just added)
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialScreen, setInitialScreen] = useState('Splash');

  useEffect(() => {
    // Placeholder: add logic to switch to Onboarding/Login after intro
    setInitialScreen('Splash');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={MenderSplashScreen} />
        <Stack.Screen name="Onboarding" component={MenderOnboardingScreens} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
        <Stack.Screen name="MyJobs" component={MyJobsScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />

        {/* Newly registered screens */}
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
        <Stack.Screen name="Screen3" component={Screen3} />
        <Stack.Screen name="Screen4" component={Screen4} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
