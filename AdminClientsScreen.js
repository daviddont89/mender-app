// AdminClientsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminClientsScreen() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filteredClients = allUsers.filter((user) => user.role === 'client');
      setClients(filteredClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const renderClient = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name || 'Unnamed Client'}</Text>
      <Text>Email: {item.email || 'N/A'}</Text>
      <Text>Jobs Posted: {item.jobsPosted?.length || 0}</Text>
      <Text>Status: {item.active ? 'Active' : 'Deactivated'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Clients</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={renderClient}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
