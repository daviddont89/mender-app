import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { AuthContext } from './AuthProvider';
import { format } from 'date-fns';

export default function PaymentHistoryScreen() {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(result);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.uid) fetchPayments();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.job}>{item.jobTitle}</Text>
            <Text style={styles.amount}>${item.amount?.toFixed(2)}</Text>
            <Text style={styles.date}>
              {format(item.date?.toDate?.() || new Date(), 'MMM d, yyyy')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  job: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  amount: { fontSize: 14, color: 'green' },
  date: { fontSize: 12, color: '#666' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
