// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './AuthProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// SCREENS
import SplashScreen from './SplashScreen';
import MenderOnboardingScreen from './MenderOnboardingScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ContractorOnboardingScreen from './ContractorOnboardingScreen';
import ClientHomeScreen from './ClientHomeScreen';
import ContractorHomeScreen from './ContractorHomeScreen';
import PostJobScreen from './PostJobScreen';
import OpenJobsScreen from './OpenJobsScreen';
import JobDetailsScreen from './JobDetailsScreen';
import AdminUserRoleScreen from './AdminUserRolesScreen';

const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const role = userSnap.data().role;
            if (role === 'contractor') {
              setInitialRoute('ContractorHome');
            } else if (role === 'client') {
              setInitialRoute('ClientHome');
            } else if (role === 'admin') {
              setInitialRoute('AdminUserRole');
            } else {
              setInitialRoute('MenderOnboarding');
            }
          } else {
            setInitialRoute('MenderOnboarding');
          }
        } catch (error) {
          console.error('Failed to fetch user role:', error);
          setInitialRoute('MenderOnboarding');
        }
      } else {
        setInitialRoute('Splash');
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return null;

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MenderOnboarding" component={MenderOnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="ContractorOnboardingScreen" component={ContractorOnboardingScreen} />
          <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
          <Stack.Screen name="ContractorHome" component={ContractorHomeScreen} />
          <Stack.Screen name="PostJob" component={PostJobScreen} />
          <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
          <Stack.Screen name="AdminUserRole" component={AdminUserRoleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
