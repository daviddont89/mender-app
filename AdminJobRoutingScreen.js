// AdminJobRoutingScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdminJobRoutingScreen() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobs'));
      const jobList = [];
      querySnapshot.forEach((doc) => {
        const job = doc.data();
        job.id = doc.id;
        jobList.push(job);
      });
      setJobs(jobList);
    } catch (err) {
      Alert.alert('Error', 'Could not load jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const routeToNextContractor = async (jobId) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        dispatchCount: (prev) => (prev || 0) + 1,
      });
      Alert.alert('Sent', 'Job sent to next contractor');
    } catch (err) {
      Alert.alert('Error', 'Could not update job');
    }
  };

  const renderJob = ({ item }) => (
    <View style={styles.jobCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Dispatched: {item.dispatchCount || 0}x</Text>
      <Button title="Route to Next Contractor" onPress={() => routeToNextContractor(item.id)} color="#008080" />
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={jobs}
      keyExtractor={(item) => item.id}
      renderItem={renderJob}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  jobCard: {
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
});
