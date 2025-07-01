// AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
