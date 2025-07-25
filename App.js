// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth & Entry Screens
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import Toast from 'react-native-toast-message';

// Role-Based Drawer Navigators
import ClientDrawerNavigator from './ClientDrawerNavigator';
import ContractorDrawerNavigator from './ContractorDrawerNavigator';
import AdminDrawerNavigator from './AdminDrawerNavigator';

// Shared Screens
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import ContractorOnboardingScreen from './ContractorOnboardingScreen';
import EditJobScreen from './EditJobScreen';
import JobReviewScreen from './JobReviewScreen';
import CompleteJobScreen from './CompleteJobScreen';
import JobTimerScreen from './JobTimerScreen';
import CompletedJobConfirmationScreen from './CompletedJobConfirmationScreen';
import ClientSubscriptionScreen from './ClientSubscriptionScreen';
import IntroScreen from './IntroScreen';
import StripeProvider from './StripeProvider';
import { AuthProvider } from './AuthProvider';
import OnboardingScreen from './OnboardingScreen';
import MySubscriptionsScreen from './MySubscriptionsScreen';
import EditContractorProfileScreen from './EditContractorProfileScreen';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Button, Platform } from 'react-native';
const Stack = createStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token || ''));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Handle notification received
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle notification response
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function sendTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test push notification from Mender!',
      },
      trigger: null,
    });
  }

  return (
    <AuthProvider>
      <StripeProvider>
        <NavigationContainer>
          {/* Test Notification Button (for demo) */}
          <Button title="Send Test Notification" onPress={sendTestNotification} />
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="IntroScreen" component={IntroScreen} />
         
            {/* Role-Based Drawers */}
            <Stack.Screen name="ClientHomeScreen" component={ClientDrawerNavigator} />
            <Stack.Screen name="ContractorHomeScreen" component={ContractorDrawerNavigator} />
            <Stack.Screen name="AdminHomeScreen" component={AdminDrawerNavigator} />
            <Stack.Screen name="ClientSubscriptionScreen" component={ClientSubscriptionScreen} />
            <Stack.Screen name="MySubscriptionsScreen" component={MySubscriptionsScreen} />
            {/* Shared Screens */}
            <Stack.Screen name="PostJobScreen" component={PostJobScreen} />
            <Stack.Screen name="OpenJobsScreen" component={OpenJobsScreen} />
            <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
            <Stack.Screen name="ContractorOnboardingScreen" component={ContractorOnboardingScreen} />
            <Stack.Screen name="EditJobScreen" component={EditJobScreen} />
            <Stack.Screen name="JobReviewScreen" component={JobReviewScreen} />
            <Stack.Screen name="CompleteJobScreen" component={CompleteJobScreen} />
            <Stack.Screen name="JobTimerScreen" component={JobTimerScreen} />
            <Stack.Screen name="CompletedJobConfirmationScreen" component={CompletedJobConfirmationScreen} />
            <Stack.Screen name="EditContractorProfileScreen" component={EditContractorProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </StripeProvider>
    </AuthProvider>
  );
}

// Helper for push notification registration
async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
