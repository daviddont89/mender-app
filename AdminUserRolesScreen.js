import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminUserRolesScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setUsers(userList);
    } catch (err) {
      Alert.alert('Error', 'Could not load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const nextRole =
      currentRole === 'client'
        ? 'contractor'
        : currentRole === 'contractor'
        ? 'admin'
        : 'client';

    try {
      await updateDoc(doc(db, 'users', userId), { role: nextRole });
      Alert.alert('Success', `Role changed to ${nextRole}`);
      fetchUsers();
    } catch (err) {
      Alert.alert('Error', 'Could not update role');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => toggleRole(item.id, item.role)}
    >
      <Text style={styles.name}>{item.name || item.email}</Text>
      <Text style={styles.role}>Current Role: {item.role}</Text>
      <Text style={styles.tapHint}>Tap to toggle role</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

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
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#555',
  },
  tapHint: {
    marginTop: 6,
    color: '#008080',
    fontStyle: 'italic',
  },
});
