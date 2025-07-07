// ContractorMetricsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ContractorMetricsScreen() {
  const [jobs, setJobs] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('contractorId', '==', auth.currentUser.uid));
        const snap = await getDocs(q);
        const jobData = snap.docs.map(doc => doc.data());
        setJobs(jobData);

        const rQuery = query(collection(db, 'contractorReviews'), where('contractorId', '==', auth.currentUser.uid));
        const rSnap = await getDocs(rQuery);
        setReviewCount(rSnap.size);
      } catch (err) {
        Alert.alert('Error', 'Unable to fetch metrics.');
      }
    };
    fetchData();
  }, []);

  const completedJobs = jobs.filter(j => j.status === 'Completed');
  const incompleteJobs = jobs.filter(j => j.status === 'Incomplete');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contractor Metrics</Text>
      <Text style={styles.metric}>Total Jobs: {jobs.length}</Text>
      <Text style={styles.metric}>Completed: {completedJobs.length}</Text>
      <Text style={styles.metric}>Incomplete: {incompleteJobs.length}</Text>
      <Text style={styles.metric}>Reviews Received: {reviewCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 20 },
  metric: { fontSize: 16, marginBottom: 10 },
});
