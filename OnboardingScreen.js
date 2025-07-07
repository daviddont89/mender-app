// 🔒 LOCKED FILE — DO NOT EDIT, FIX, OR REPLACE
// OnboardingScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mender</Text>
      <Text style={styles.subtitle}>
        Your premium home repair and improvement service.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonOutlineText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('ContractorOnboarding')}
      >
        <Text style={styles.linkText}>Apply as a Contractor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonOutline: {
    borderColor: '#008080',
    borderWidth: 2,
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonOutlineText: {
    color: '#008080',
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#555',
    textDecorationLine: 'underline',
  },
});
