// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function HomeScreen() {
  const completedJobs = [
    { id: '1', title: 'Repaired drywall in kitchen' },
    { id: '2', title: 'Installed faucet for client' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Jobs</Text>
      <FlatList
        data={completedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.jobTitle}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No jobs yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#008080',
  },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    color: '#333',
  },
});
