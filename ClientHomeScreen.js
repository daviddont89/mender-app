// 🔒 LOCKED FILE — DO NOT EDIT, FIX, OR REPLACE
// ClientHomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import JobCard from './components/JobCard';

export default function ClientHomeScreen() {
  const navigation = useNavigation();
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('clientId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPostedJobs(jobs);
      setLoading(false);
    } catch (err) {
      console.error('Error loading jobs:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Mender</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostJob')}>
        <Text style={styles.buttonText}>Post a New Job</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Your Jobs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : postedJobs.length > 0 ? (
        postedJobs.map(job => <JobCard key={job.id} job={job} />)
      ) : (
        <Text style={styles.emptyText}>You haven’t posted any jobs yet.</Text>
      )}

      <Text style={styles.sectionHeader}>Recently Completed in Your Area</Text>
      {/* Static data for now — to be dynamic in v2 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.completedJobCard}><Text>Painted Deck - 98366</Text></View>
        <View style={styles.completedJobCard}><Text>Roof Repair - 98367</Text></View>
        <View style={styles.completedJobCard}><Text>Fence Install - 98310</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  completedJobCard: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
  },
});
