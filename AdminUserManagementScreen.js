import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import firebaseApp from './firebase';

const db = getFirestore(firebaseApp);

export default function AdminUserManagementScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCol = collection(db, 'users');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users.');
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  const changeRole = async (userId, currentRole) => {
    const newRole =
      currentRole === 'contractor'
        ? 'client'
        : currentRole === 'client'
        ? 'admin'
        : 'contractor';

    try {
      setUpdatingId(userId);
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      Alert.alert('Success', `User role changed to ${newRole}.`);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user role.');
      console.error('Update error:', error);
    }
    setUpdatingId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Role Management</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.name}>{item.email}</Text>
            <Text style={styles.role}>Role: {item.role}</Text>
            <TouchableOpacity
              onPress={() => changeRole(item.id, item.role)}
              style={styles.button}
              disabled={updatingId === item.id}
            >
              <Text style={styles.buttonText}>
                {updatingId === item.id ? 'Updating...' : 'Change Role'}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  role: { fontSize: 14, marginBottom: 10 },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
