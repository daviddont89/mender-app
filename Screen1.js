import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function Screen1() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('./Icons/mender-icon.png')} // Ensure this file exists
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.header}>How Mender Works</Text>
      <Text style={styles.paragraph}>
        Mender connects clients with qualified contractors for household jobs.
        Post a job, get matched, and track progress all within the app.
      </Text>
      <Text style={styles.paragraph}>
        Clients pay $75/hr. Contractors earn $50/hr. All jobs include a one-hour
        minimum, covering drive time.
      </Text>
      <Text style={styles.paragraph}>
        Schedule, upload media, add gate codes, and rate jobs for better matches.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
    fontFamily: 'MenderFont',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
});
