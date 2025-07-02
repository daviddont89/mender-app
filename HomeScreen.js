import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Mender</Text>
      <Text style={styles.subtext}>Your hub for hiring and handling jobs.</Text>
      <View style={styles.buttons}>
        <Button title="Post a Job" onPress={() => navigation.navigate('PostJobScreen')} />
        <Button title="View Open Jobs" onPress={() => navigation.navigate('OpenJobsScreen')} />
        <Button title="My Jobs" onPress={() => navigation.navigate('MyJobsScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    fontFamily: 'MenderFont',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
});
