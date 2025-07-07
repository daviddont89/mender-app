// PaymentHistoryScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const payments = [
  { id: '1', date: '2025-07-01', amount: '$75', job: 'Toilet Repair' },
  { id: '2', date: '2025-07-03', amount: '$150', job: 'Gutter Cleaning' },
];

export default function PaymentHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={payments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.job}>{item.job}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  job: { fontSize: 16, fontWeight: 'bold' },
  amount: { fontSize: 14, color: 'green' },
  date: { fontSize: 12, color: '#666' },
});
