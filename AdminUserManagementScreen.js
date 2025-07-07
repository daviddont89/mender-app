// AdminUserManagementScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import firebaseApp from './firebase';

const db = getFirestore(firebaseApp);

export default function AdminUserManagementScreen() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  const changeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'contractor' ? 'client' : currentRole === 'client' ? 'admin' : 'contractor';
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    Alert.alert('Role Updated', `User role changed to ${newRole}.`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Role Management</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.name}>{item.email}</Text>
            <Text style={styles.role}>Role: {item.role}</Text>
            <TouchableOpacity onPress={() => changeRole(item.id, item.role)} style={styles.button}>
              <Text style={styles.buttonText}>Change Role</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  userCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  role: { fontSize: 14, marginBottom: 6 },
  button: {
    backgroundColor: '#007C91',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
