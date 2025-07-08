// WelcomeBackScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function WelcomeBackScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.text}>Let’s get you to your dashboard.</Text>
      <Button title="Continue" onPress={() => navigation.navigate('LoginScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 20 },
});
