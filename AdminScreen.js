// AdminScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { useNavigation } from '@react-navigation/native';

const roles = ['client', 'contractor', 'admin'];

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(firestore, 'users'));
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Could not load users.');
    }
    setLoading(false);
  };

  const cycleRole = async (userId, currentRole) => {
    const currentIndex = roles.indexOf(currentRole);
    const newRole = roles[(currentIndex + 1) % roles.length];

    try {
      await updateDoc(doc(firestore, 'users', userId), { role: newRole });
      Alert.alert('Success', `Role changed to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to change role.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Role Manager</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : (
        <ScrollView style={styles.scroll}>
          {users.map(user => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.label}>Role: {user.role || 'client'}</Text>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => cycleRole(user.id, user.role || 'client')}
              >
                <Text style={styles.toggleText}>Change Role</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  scroll: {
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: '#f0f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#008080',
    borderWidth: 1,
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 20,
    padding: 5,
  },
  backText: {
    fontSize: 16,
    color: '#008080',
  },
});
