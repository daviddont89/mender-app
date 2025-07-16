import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminAdControlScreen() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingAds = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'contractorAds'), where('approved', '==', false));
      const snapshot = await getDocs(q);
      const pendingAds = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAds(pendingAds);
    } catch (err) {
      console.error('Failed to fetch ads:', err);
      Alert.alert('Error', 'Could not load ads.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adId) => {
    try {
      await updateDoc(doc(db, 'contractorAds', adId), { approved: true });
      Alert.alert('Approved', 'Ad is now live.');
      fetchPendingAds();
    } catch (err) {
      Alert.alert('Error', 'Failed to approve ad.');
    }
  };

  const handleReject = async (adId) => {
    try {
      await updateDoc(doc(db, 'contractorAds', adId), { rejected: true });
      Alert.alert('Rejected', 'Ad has been marked as rejected.');
      fetchPendingAds();
    } catch (err) {
      Alert.alert('Error', 'Failed to reject ad.');
    }
  };

  useEffect(() => {
    fetchPendingAds();
  }, []);

  const renderAdCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageURL }} style={styles.image} />
      <Text style={styles.blurb}>{item.blurb}</Text>
      <Text style={styles.info}>Budget: ${item.budget} | {item.weeksVisible} weeks</Text>
      <Text style={styles.info}>Contractor ID: {item.contractorId}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.approve} onPress={() => handleApprove(item.id)}>
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reject} onPress={() => handleReject(item.id)}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Ads</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id}
          renderItem={renderAdCard}
          ListEmptyComponent={<Text>No pending ads</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 16 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  blurb: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  info: { fontSize: 12, color: '#555' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  approve: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  reject: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
