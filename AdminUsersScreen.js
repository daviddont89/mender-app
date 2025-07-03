// AdminUsersScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const AdminUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const cycleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'client' ? 'contractor' : currentRole === 'contractor' ? 'admin' : 'client';
    try {
      await updateDoc(doc(db, 'users', userId), { role: nextRole });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: nextRole } : user
        )
      );
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update role.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.email}</Text>
      <Text style={styles.role}>Role: {item.role}</Text>
      <TouchableOpacity style={styles.button} onPress={() => cycleRole(item.id, item.role)}>
        <Text style={styles.buttonText}>Change Role</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin User Management</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00bcd4" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default AdminUsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  role: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  button: {
    backgroundColor: '#00bcd4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
