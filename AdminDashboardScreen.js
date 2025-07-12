import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdminDashboardScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const loadedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(loadedUsers);
    } catch (err) {
      Alert.alert('Error', 'Failed to load users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole =
      currentRole === 'client'
        ? 'contractor'
        : currentRole === 'contractor'
        ? 'admin'
        : 'client';

    try {
      setUpdatingId(userId);
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      Alert.alert('Success', `Updated role to: ${newRole}`);
      await loadUsers();
    } catch (err) {
      console.error('Error updating role:', err);
      Alert.alert('Error', 'Could not update role.');
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.userText}>
              <Text style={{ fontWeight: 'bold' }}>{item.email}</Text> — {item.role}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => toggleRole(item.id, item.role)}
              disabled={updatingId === item.id}
            >
              <Text style={styles.buttonText}>
                {updatingId === item.id ? 'Updating...' : 'Cycle Role'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#008080',
    textAlign: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 14,
  },
  userText: { fontSize: 16, marginBottom: 10 },
  button: {
    backgroundColor: '#008080',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
