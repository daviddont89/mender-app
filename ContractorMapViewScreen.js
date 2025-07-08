// ContractorMapViewScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ContractorMapViewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map view will be added in Phase 2.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#555', textAlign: 'center', paddingHorizontal: 20 },
});
