import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

export default function ClientJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const isFocused = useIsFocused();

  const fetchClientJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('clientId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const jobList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  useEffect(() => {
    if (isFocused) fetchClientJobs();
  }, [isFocused]);

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetailsScreen', { jobId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.description?.slice(0, 60)}...</Text>
      <View style={styles.row}>
        <Text style={styles.status}>{item.status}</Text>
        <Text style={styles.date}>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleDateString()
            : 'No Date'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Jobs</Text>
      {jobs.length === 0 ? (
        <Text style={styles.empty}>You haven’t posted any jobs yet.</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id}
          renderItem={renderJob}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontWeight: '600',
    color: '#008080',
  },
  date: {
    color: '#999',
    fontSize: 13,
  },
});
