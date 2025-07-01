// Mender App - Navigation + Onboarding Screens
// Using React Native + Expo Navigation

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import PostJobScreen from './PostJobScreen';
import HomeScreen from './HomeScreen';
import JobDetailsScreen from './JobDetailsScreen';
import OpenJobsScreen from './OpenJobsScreen';
import MyJobsScreen from './MyJobsScreen';
import MenderSplashScreen from './MenderSplashScreen';

const Stack = createStackNavigator();

// ----- Screen 1 -----
const Screen1 = ({ navigation }) => (
  <View style={styles.container}>
    <Image source={require('./assets/mender-logo.png')} style={styles.logo} />
    <Text style={styles.title}>Mender</Text>
    <Text style={styles.subtitle}>Handyman on demand</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Screen2')}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  </View>
);

// ----- Screen 2 -----
const Screen2 = ({ navigation }) => (
  <View style={styles.container}>
    <Image source={require('./assets/clipboard.png')} style={styles.icon} />
    <Text style={styles.title}>Post a Job</Text>
    <Text style={styles.text}>Create a job request by providing details, photos, and the location.</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Screen3')}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  </View>
);

// ----- Screen 3 -----
const Screen3 = ({ navigation }) => (
  <View style={styles.container}>
    <Image source={require('./assets/worker.png')} style={styles.icon} />
    <Text style={styles.title}>Pay & Rate</Text>
    <Text style={styles.text}>Pay securely through the app and rate your handyman.</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Screen4')}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  </View>
);

// ----- Screen 4 -----
const Screen4 = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Let’s Get Started</Text>
    <Text style={styles.text}>Sign up or log in to get the job done right.</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Login')}>
      <Text style={styles.buttonOutlineText}>Log In</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#004d4d',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 40,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    borderColor: '#008080',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonOutlineText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: '600',
  },
});

// ---- Main App Navigation ----

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Onboarding Screens */}
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
        <Stack.Screen name="Screen3" component={Screen3} />
        <Stack.Screen name="Screen4" component={Screen4} />

        {/* Auth Screens */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main App Screens */}
        <Stack.Screen name="MainHome" component={HomeScreen} /> {/* Avoids Home > Home warning */}
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="OpenJobs" component={OpenJobsScreen} />
        <Stack.Screen name="MyJobs" component={MyJobsScreen} />
        <Stack.Screen name="Splash" component={MenderSplashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
