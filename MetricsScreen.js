// MetricsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MetricsScreen({ route }) {
  const { contractor } = route.params || {};
  const dummyMetrics = {
    jobsCompleted: 18,
    hoursWorked: 77,
    averageRating: 'Excellent',
    cancelRate: '5%',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Metrics</Text>
      <Text style={styles.metric}>Jobs Completed: {dummyMetrics.jobsCompleted}</Text>
      <Text style={styles.metric}>Hours Worked: {dummyMetrics.hoursWorked}</Text>
      <Text style={styles.metric}>Avg. Client Rating: {dummyMetrics.averageRating}</Text>
      <Text style={styles.metric}>Job Cancellation Rate: {dummyMetrics.cancelRate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  metric: { fontSize: 18, marginBottom: 12 },
});
