// ContractorAdCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ContractorAdCard({ blurb, imageURL, contractorId, budget }) {
  return (
    <View style={styles.card}>
      {imageURL && <Image source={{ uri: imageURL }} style={styles.image} />}
      <Text style={styles.blurb}>{blurb}</Text>
      <Text style={styles.meta}>Contractor ID: {contractorId}</Text>
      <Text style={styles.meta}>Budget: ${budget}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  blurb: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  meta: { fontSize: 12, color: '#666' },
});
