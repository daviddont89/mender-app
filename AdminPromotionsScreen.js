// AdminPromotionsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function AdminPromotionsScreen() {
  const [promotions, setPromotions] = useState([]);
  const [newPromo, setNewPromo] = useState('');

  const fetchPromotions = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'promotions'));
      const promos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromotions(promos);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAddPromo = async () => {
    if (!newPromo.trim()) return;

    try {
      await addDoc(collection(db, 'promotions'), {
        message: newPromo,
        createdAt: new Date().toISOString(),
      });
      setNewPromo('');
      fetchPromotions();
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  const handleDeletePromo = async (id) => {
    Alert.alert('Delete Promotion', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'promotions', id));
            fetchPromotions();
          } catch (error) {
            console.error('Error deleting promotion:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <TouchableOpacity
        onPress={() => handleDeletePromo(item.id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Promotions</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newPromo}
          onChangeText={setNewPromo}
          placeholder="New promotion message"
        />
        <TouchableOpacity onPress={handleAddPromo} style={styles.addBtn}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={promotions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  addBtn: {
    backgroundColor: '#008080',
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    padding: 14,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 6,
  },
  deleteBtn: {
    backgroundColor: '#c62828',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
