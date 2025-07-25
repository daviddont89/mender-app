// AdminUserListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminUserListScreen() {
  const [users, setUsers] = useState([]);
  // Add faux/test users for demo if empty
  if (users.length === 0) {
    setUsers([
      { id: 'u1', email: 'jane.client@email.com', role: 'client' },
      { id: 'u2', email: 'carlos.contractor@email.com', role: 'contractor' },
      { id: 'u3', email: 'admin@mender.com', role: 'admin' },
    ]);
  }
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const updateRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.role}>Current Role: {item.role || 'none'}</Text>

      <View style={styles.buttonRow}>
        {['client', 'contractor', 'admin'].map(role => (
          <TouchableOpacity
            key={role}
            style={[styles.roleButton, item.role === role && styles.selected]}
            onPress={() => updateRole(item.id, role)}
          >
            <Text style={styles.buttonText}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage User Roles</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00bfa5" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    marginBottom: 10,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
    flex: 1,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#00bfa5',
  },
  buttonText: {
    color: '#000',
  },
});
