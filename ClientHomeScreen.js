// ClientHomeScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import JobCard from './components/JobCard';

export default function ClientHomeScreen() {
  const navigation = useNavigation();
  const [postedJobs, setPostedJobs] = useState([]);
  const [completedNearbyJobs, setCompletedNearbyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPostedJobs = async () => {
    const q = query(collection(db, 'jobs'), where('clientId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const fetchCompletedNearbyJobs = async () => {
    const q = query(collection(db, 'jobs'), where('status', '==', 'Completed'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const [posted, nearby] = await Promise.all([
        fetchPostedJobs(),
        fetchCompletedNearbyJobs(),
      ]);
      setPostedJobs(posted);
      setCompletedNearbyJobs(nearby);
    } catch (e) {
      console.error('Error loading jobs:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Client Home</Text>

      <Button title="Post a New Job" onPress={() => navigation.navigate('PostJobScreen')} />

      {loading ? (
        <ActivityIndicator size="large" color="#00aaff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.scroll}>
          <Text style={styles.sectionTitle}>Your Posted Jobs</Text>
          {postedJobs.length > 0 ? (
            postedJobs.map(job => (
              <TouchableOpacity key={job.id} onPress={() => navigation.navigate('JobDetailsScreen', { job })}>
                <JobCard job={job} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.empty}>You haven’t posted any jobs yet.</Text>
          )}

          <Text style={styles.sectionTitle}>Completed Jobs in Your Area</Text>
          {completedNearbyJobs.length > 0 ? (
            completedNearbyJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <Text style={styles.empty}>No completed jobs found nearby.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 15, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  scroll: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  empty: { textAlign: 'center', color: '#777', marginBottom: 20 },
});
