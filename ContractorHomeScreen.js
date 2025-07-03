import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ContractorHomeScreen() {
  const navigation = useNavigation();

  const acceptedJobs = [
    { id: 'a1', title: 'Roof Leak Repair – Cedar Hill' },
    { id: 'a2', title: 'Bathroom Tile Fix – Willow Way' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Contractor!</Text>

      <Button title="Browse Open Jobs" onPress={() => navigation.navigate('OpenJobs')} />

      <Text style={styles.sectionTitle}>Your Accepted Jobs</Text>
      {acceptedJobs.map((job) => (
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
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginBottom: 10,
  },
});
