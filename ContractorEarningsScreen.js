// ContractorEarningsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ContractorEarningsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earnings Overview</Text>
      <Text style={styles.amount}>$0.00</Text>
      <Text style={styles.note}>Tracking begins once you start completing jobs.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  amount: { fontSize: 36, color: '#008080', fontWeight: 'bold' },
  note: { fontSize: 14, color: '#666', marginTop: 10, textAlign: 'center' },
});
