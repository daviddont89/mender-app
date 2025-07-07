// AdminDashboardScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdminDashboardScreen() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const loadedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(loadedUsers);
    } catch (err) {
      Alert.alert('Error', 'Failed to load users.');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'client' ? 'contractor' : currentRole === 'contractor' ? 'admin' : 'client';
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      Alert.alert('Success', `Role updated to ${newRole}`);
      loadUsers();
    } catch (err) {
      Alert.alert('Error', 'Could not update role.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.email} - {item.role}</Text>
            <Button title="Toggle Role" onPress={() => toggleRole(item.id, item.role)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  userItem: { marginBottom: 10 },
  userText: { marginBottom: 6 },
});
