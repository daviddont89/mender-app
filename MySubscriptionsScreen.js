import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const testSubscriptions = [
  {
    id: '1',
    title: 'Fall Essentials',
    status: 'active',
    purchasedAt: '2023-09-25',
    price: 199,
  },
  {
    id: '2',
    title: 'Summer Deluxe',
    status: 'expired',
    purchasedAt: '2023-06-15',
    price: 299,
  },
  {
    id: '3',
    title: 'Winter Comfort',
    status: 'active',
    purchasedAt: '2023-12-22',
    price: 249,
  },
];

export default function MySubscriptionsScreen() {
  const [subs, setSubs] = useState(testSubscriptions);
  // Add more faux/test subscriptions for demo if empty
  if (subs.length === 0) {
    setSubs([
      { id: '4', title: 'Spring Deluxe', status: 'active', purchasedAt: '2024-03-21', price: 299 },
      { id: '5', title: 'Summer Premium', status: 'expired', purchasedAt: '2023-06-21', price: 399 },
    ]);
  }

  const handleCancel = (id) => {
    setSubs(subs.map(sub => sub.id === id ? { ...sub, status: 'cancelled' } : sub));
  };

  const renderSub = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.date}>Purchased: {item.purchasedAt}</Text>
      <Text style={styles.price}>${item.price}</Text>
      {item.status === 'active' && (
        <TouchableOpacity style={styles.button} onPress={() => handleCancel(item.id)}>
          <Text style={styles.buttonText}>Cancel Subscription</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Subscriptions</Text>
      <FlatList
        data={subs}
        keyExtractor={item => item.id}
        renderItem={renderSub}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 12 },
  card: {
    backgroundColor: '#f4f4f4', borderRadius: 10,
    padding: 16, marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 15, color: '#555', marginBottom: 4 },
  date: { fontSize: 14, color: '#888', marginBottom: 4 },
  price: { fontSize: 16, color: 'green', marginBottom: 8 },
  button: {
    marginTop: 10, backgroundColor: '#008080',
    padding: 10, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
}); 