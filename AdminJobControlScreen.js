// AdminJobControlScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import firebaseApp from './firebase';

const db = getFirestore(firebaseApp);

export default function AdminJobControlScreen() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const jobsCol = collection(db, 'jobs');
    const snapshot = await getDocs(jobsCol);
    const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setJobs(jobList);
  };

  const cycleStatus = async (jobId, currentStatus) => {
    const statusOrder = ['Open', 'Accepted', 'In Progress', 'Completed', 'Incomplete'];
    const nextStatus = statusOrder[(statusOrder.indexOf(currentStatus) + 1) % statusOrder.length];
    await updateDoc(doc(db, 'jobs', jobId), { status: nextStatus });
    Alert.alert('Status Updated', `Job status updated to ${nextStatus}.`);
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Job Controls</Text>
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <TouchableOpacity onPress={() => cycleStatus(item.id, item.status)} style={styles.button}>
              <Text style={styles.buttonText}>Change Status</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  jobCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 14, marginBottom: 6 },
  button: {
    backgroundColor: '#007C91',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
