import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminJobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'jobs'));
      const jobList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Alert.alert('Error', 'Failed to fetch jobs from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderJob = ({ item }) => {
    const postedDate = item.createdAt?.seconds
      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
      : 'Unknown';

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title || 'Untitled Job'}</Text>
        <Text>Status: <Text style={styles.value}>{item.status || 'Unknown'}</Text></Text>
        <Text>Client: <Text style={styles.value}>{item.clientEmail || item.clientId || 'N/A'}</Text></Text>
        <Text>Contractor: <Text style={styles.value}>{item.contractorEmail || item.contractorId || 'Unassigned'}</Text></Text>
        <Text>Posted: <Text style={styles.value}>{postedDate}</Text></Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Jobs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJob}
          ListEmptyComponent={<Text>No jobs found.</Text>}
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0fdfd',
    padding: 16,
    borderRadius: 10,
    borderColor: '#d6f0f2',
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d4d',
    marginBottom: 6,
  },
  value: {
    color: '#333',
  },
});
