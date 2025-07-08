// ContractorListViewScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const dummyData = [
  { id: '1', name: 'John Doe', specialty: 'Plumber' },
  { id: '2', name: 'Jane Smith', specialty: 'Electrician' },
];

export default function ContractorListViewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contractors - List View</Text>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: { fontSize: 18 },
  specialty: { fontSize: 14, color: '#555' },
});
