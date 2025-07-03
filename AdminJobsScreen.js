// AdminJobsScreen.js
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

export default function AdminJobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'jobs'));
      const jobList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderJob = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title || 'Untitled Job'}</Text>
      <Text>Status: {item.status || 'Unknown'}</Text>
      <Text>Client: {item.clientEmail || 'N/A'}</Text>
      <Text>Contractor: {item.contractorEmail || 'Unassigned'}</Text>
      <Text>Posted: {item.postedAt ? new Date(item.postedAt.seconds * 1000).toLocaleDateString() : 'Unknown'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Jobs</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJob}
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
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
});
