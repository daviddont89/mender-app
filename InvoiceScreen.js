// InvoiceScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InvoiceScreen({ route }) {
  const { job } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice</Text>
      <Text style={styles.label}>Job:</Text>
      <Text>{job.title}</Text>
      <Text style={styles.label}>Rate:</Text>
      <Text>$75/hr</Text>
      <Text style={styles.label}>Duration:</Text>
      <Text>{job.hours || 2} hrs</Text>
      <Text style={styles.label}>Total:</Text>
      <Text>${(job.hours || 2) * 75}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
});
