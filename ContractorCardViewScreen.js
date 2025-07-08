// ContractorCardViewScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dummyData = [
  { id: '1', name: 'John Doe', rating: 4.9 },
  { id: '2', name: 'Jane Smith', rating: 4.7 },
];

export default function ContractorCardViewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contractors - Card View</Text>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Rating: {item.rating}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: '#e0f7f7',
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: '600' },
});
