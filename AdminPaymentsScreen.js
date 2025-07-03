// AdminPaymentsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminPaymentsScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'jobs'));
      const completedJobs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((job) => job.status === 'Completed');
      setPayments(completedJobs);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const renderPayment = ({ item }) => {
    const hours = item.totalHours || 1; // fallback to 1 if not set
    const clientCharge = 75 * hours;
    const contractorPayout = 50 * hours;

    return (
      <View style={styles.card}>
        <Text style={styles.jobTitle}>{item.title || 'Untitled Job'}</Text>
        <Text>Client Charged: ${clientCharge.toFixed(2)}</Text>
        <Text>Contractor Payout: ${contractorPayout.toFixed(2)}</Text>
        <Text>Status: {item.status}</Text>
        <Text>Date: {item.completedAt || 'N/A'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payments Overview</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderPayment}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
