// ClientHomeScreen.js
import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ClientHomeScreen() {
  const navigation = useNavigation();

  const completedJobs = [
    { id: '1', title: 'Gutter Cleaning – Maple Street' },
    { id: '2', title: 'Fence Repair – Birch Avenue' },
  ];

  const postedJobs = [
    { id: '3', title: 'Deck Refinishing – Pine Blvd' },
    { id: '4', title: 'Drywall Repair – Oak Loop' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Client!</Text>

      <Button title="Post a New Job" onPress={() => navigation.navigate('PostJob')} />

      <Text style={styles.sectionTitle}>Completed Jobs In Your Area</Text>
      {completedJobs.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <Text>{job.title}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Your Posted Jobs</Text>
      {postedJobs.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <Text>{job.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 8,
  },
  jobCard: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
});
