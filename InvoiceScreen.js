import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InvoiceScreen({ route }) {
  const { job } = route.params;

  const rate = 75;
  const totalMinutes = job.totalMinutes || 60;
  const hours = Math.max(totalMinutes / 60, 1);
  const total = rate * hours;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Job:</Text>
        <Text style={styles.value}>{job.title}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Rate:</Text>
        <Text style={styles.value}>$75/hr</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Time Billed:</Text>
        <Text style={styles.value}>{hours.toFixed(2)} hrs</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Due:</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flex: 1 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 30,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: { fontWeight: '600', color: '#444', fontSize: 16 },
  value: { fontSize: 16, color: '#222' },
  totalRow: {
    marginTop: 30,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#008080' },
});
