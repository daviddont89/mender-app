// MaintenanceTipsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MaintenanceTipsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Seasonal Maintenance Tips</Text>
      <Text style={styles.tip}>• Clean gutters in spring and fall.</Text>
      <Text style={styles.tip}>• Test smoke detectors monthly.</Text>
      <Text style={styles.tip}>• Winterize outdoor faucets before first frost.</Text>
      <Text style={styles.tip}>• Check HVAC filters every 3 months.</Text>
      <Text style={styles.tip}>• Inspect roof and caulking yearly.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  tip: { fontSize: 16, marginBottom: 10 },
});
