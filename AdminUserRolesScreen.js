// AdminUserRolesScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminUserRolesScreen() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = [];
      querySnapshot.forEach((docSnap) => {
        userList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUsers(userList);
    } catch (err) {
      Alert.alert('Error', 'Could not load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const nextRole =
      currentRole === 'client' ? 'contractor' :
      currentRole === 'contractor' ? 'admin' :
      'client';
    try {
      await updateDoc(doc(db, 'users', userId), { role: nextRole });
      fetchUsers();
    } catch (err) {
      Alert.alert('Error', 'Could not update role');
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleRole(item.id, item.role)}
      style={styles.userCard}
    >
      <Text style={styles.name}>{item.name || item.email}</Text>
      <Text>Current Role: {item.role}</Text>
      <Text style={styles.action}>Tap to toggle</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.container}
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={renderUser}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  userCard: {
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  action: { color: '#008080', marginTop: 6 },
});
