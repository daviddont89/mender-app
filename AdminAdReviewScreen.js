// AdminAdReviewScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from './firebase';

export default function AdminAdReviewScreen() {
  const [ads, setAds] = useState([]);
  const [editingAdId, setEditingAdId] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'contractorAds'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(list);
    } catch (e) {
      console.error('Failed to fetch ads:', e);
    }
  };

  const toggleApproval = async (adId, current) => {
    try {
      await updateDoc(doc(db, 'contractorAds', adId), { approved: !current });
      fetchAds();
    } catch (e) {
      Alert.alert('Error', 'Failed to update approval');
    }
  };

  const saveAdEdits = async (adId, updatedAd) => {
    try {
      const updatePayload = {
        budget: parseFloat(updatedAd.budget),
        expirationDate: Timestamp.fromDate(new Date(updatedAd.expirationDate)),
        updatedAt: Timestamp.now(),
      };
      await updateDoc(doc(db, 'contractorAds', adId), updatePayload);
      setEditingAdId(null);
      fetchAds();
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🛠 Ad Review & Approval</Text>

      {ads.map(ad => (
        <View key={ad.id} style={styles.card}>
          <Image source={{ uri: ad.imageUrl }} style={styles.image} />
          <Text style={styles.label}>Blurb:</Text>
          <Text style={styles.text}>{ad.blurb}</Text>
          <Text>Contractor: {ad.contractorId}</Text>
          <Text>Status: {ad.approved ? '✅ Approved' : '⏳ Pending'}</Text>

          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => toggleApproval(ad.id, ad.approved)}
          >
            <Text style={styles.approveText}>
              {ad.approved ? 'Reject' : 'Approve'}
            </Text>
          </TouchableOpacity>

          {editingAdId === ad.id ? (
            <>
              <Text style={styles.label}>Budget ($):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={ad.budget.toString()}
                onChangeText={(val) =>
                  setAds(prev =>
                    prev.map(a => a.id === ad.id ? { ...a, budget: val } : a)
                  )
                }
              />

              <Text style={styles.label}>Expiration Date:</Text>
              <DateTimePicker
                value={new Date(ad.expirationDate?.toDate?.() || Date.now())}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setAds(prev =>
                      prev.map(a => a.id === ad.id ? { ...a, expirationDate: selectedDate } : a)
                    );
                  }
                }}
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => saveAdEdits(ad.id, ad)}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditingAdId(ad.id)}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: { width: '100%', height: 180, borderRadius: 10, marginBottom: 10 },
  label: { fontWeight: 'bold', marginTop: 10 },
  text: { marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginTop: 6, marginBottom: 10,
  },
  approveBtn: {
    backgroundColor: '#008080', padding: 10, borderRadius: 8, marginTop: 12, alignItems: 'center',
  },
  approveText: { color: '#fff', fontWeight: 'bold' },
  editBtn: {
    backgroundColor: '#ccc', padding: 8, borderRadius: 6, marginTop: 10, alignItems: 'center',
  },
  editText: { color: '#333' },
  saveBtn: {
    backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, marginTop: 14, alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
});
