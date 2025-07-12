import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import firebaseApp from './firebase';

const db = getFirestore(firebaseApp);

export default function AdminJobControlScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobsCol = collection(db, 'jobs');
      const snapshot = await getDocs(jobsCol);
      const jobList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    } catch (err) {
      Alert.alert('Error', 'Failed to load jobs.');
      console.error('Job fetch error:', err);
    }
    setLoading(false);
  };

  const cycleStatus = async (jobId, currentStatus) => {
    const statusOrder = ['Open', 'Accepted', 'In Progress', 'Completed', 'Incomplete'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      setUpdatingId(jobId);
      await updateDoc(doc(db, 'jobs', jobId), { status: nextStatus });
      Alert.alert('Success', `Job status updated to ${nextStatus}`);
      fetchJobs();
    } catch (err) {
      Alert.alert('Error', 'Could not update job status.');
      console.error('Status update error:', err);
    }
    setUpdatingId(null);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Job Controls</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <Text style={styles.name}>{item.title || 'Untitled Job'}</Text>
              <Text style={styles.label}>Status: <Text style={styles.value}>{item.status}</Text></Text>
              <Text style={styles.label}>Job ID: <Text style={styles.value}>{item.id}</Text></Text>
              <TouchableOpacity
                onPress={() => cycleStatus(item.id, item.status)}
                style={styles.button}
                disabled={updatingId === item.id}
              >
                <Text style={styles.buttonText}>
                  {updatingId === item.id ? 'Updating...' : 'Cycle Status'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#008080',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#eefefe',
    borderColor: '#aadada',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  label: { fontWeight: '600', color: '#444' },
  value: { fontWeight: 'normal', color: '#333' },
  button: {
    marginTop: 12,
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
