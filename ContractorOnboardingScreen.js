// 🔒 LOCKED FILE — DO NOT EDIT, FIX, OR REPLACE
// ContractorOnboardingScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ContractorOnboardingScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Join the Mender Network</Text>
      <Text style={styles.paragraph}>
        Mender is a premium handyman platform connecting top-quality contractors
        with high-value clients. Set your schedule, receive jobs based on location,
        and get paid weekly.
      </Text>
      <Text style={styles.paragraph}>
        You'll need a valid business license, your own tools, and transportation.
        We handle the scheduling, customer acquisition, and billing.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup', { role: 'contractor' })}
      >
        <Text style={styles.buttonText}>Apply Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
    color: '#444',
  },
  button: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
