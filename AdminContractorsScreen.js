// AdminContractorsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function AdminContractorsScreen() {
  const [contractors, setContractors] = useState([]);

  const fetchContractors = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const filtered = snapshot.docs
        .filter((doc) => doc.data().role === 'contractor')
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setContractors(filtered);
    } catch (error) {
      console.error('Error fetching contractors:', error);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const toggleVerification = async (id, currentStatus) => {
    try {
      const ref = doc(db, 'users', id);
      await updateDoc(ref, { verified: !currentStatus });
      fetchContractors();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const handleRemove = (id) => {
    Alert.alert('Remove Contractor', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Remove',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', id));
            fetchContractors();
          } catch (error) {
            console.error('Error removing contractor:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name || item.email}</Text>
      <Text style={styles.details}>Email: {item.email}</Text>
      <Text style={styles.details}>Verified: {item.verified ? 'Yes' : 'No'}</Text>
      <Text style={styles.details}>Jobs Completed: {item.jobsCompleted || 0}</Text>
      <Text style={styles.details}>Rating: {item.rating || 'N/A'}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={() => toggleVerification(item.id, item.verified)}
        >
          <Text style={styles.verifyText}>
            {item.verified ? 'Unverify' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemove(item.id)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contractors</Text>

      <FlatList
        data={contractors}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 16 },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  details: { fontSize: 14, marginBottom: 2 },
  actions: { flexDirection: 'row', marginTop: 10 },
  verifyBtn: {
    backgroundColor: '#00796B',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  verifyText: { color: '#fff', fontWeight: 'bold' },
  removeBtn: {
    backgroundColor: '#c62828',
    padding: 8,
    borderRadius: 6,
  },
  removeText: { color: '#fff', fontWeight: 'bold' },
});
