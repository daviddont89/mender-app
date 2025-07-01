// MyJobsScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function MyJobsScreen() {
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('urgency'); // or 'date'
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRef = collection(db, 'jobs');

        const acceptedQuery = query(
          jobsRef,
          where('contractorId', '==', user.uid),
          where('status', '==', 'accepted')
        );

        const completedQuery = query(
          jobsRef,
          where('contractorId', '==', user.uid),
          where('status', '==', 'completed')
        );

        const [acceptedSnap, completedSnap] = await Promise.all([
          getDocs(acceptedQuery),
          getDocs(completedQuery)
        ]);

        const sortJobs = (jobs) => {
          return jobs.sort((a, b) => {
            if (sortBy === 'urgency') {
              const order = { Emergency: 1, Normal: 2, Flexible: 3 };
              return (order[a.urgency] || 4) - (order[b.urgency] || 4);
            } else {
              return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            }
          });
        };

        setAcceptedJobs(sortJobs(acceptedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
        setCompletedJobs(sortJobs(completedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
      } catch (error) {
        console.error('Error fetching contractor jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [sortBy]);

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={[styles.urgencyBadge, getUrgencyStyle(item.urgency)]}>
          {item.urgency || 'Normal'}
        </Text>
      </View>
      <Text style={styles.jobDescription}>{item.description}</Text>
      {item.photos && item.photos[0] && (
        <Image source={{ uri: item.photos[0] }} style={styles.photo} />
      )}
    </TouchableOpacity>
  );

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return { backgroundColor: '#cc0000' };
      case 'Normal':
        return { backgroundColor: '#008000' };
      case 'Flexible':
        return { backgroundColor: '#0066cc' };
      default:
        return { backgroundColor: '#999' };
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.sortRow}>
        <Text style={styles.header}>My Jobs</Text>
        <View style={styles.sortButtons}>
          <Pressable
            style={[styles.sortOption, sortBy === 'urgency' && styles.activeSort]}
            onPress={() => setSortBy('urgency')}
          >
            <Text style={styles.sortText}>Urgency</Text>
          </Pressable>
          <Pressable
            style={[styles.sortOption, sortBy === 'date' && styles.activeSort]}
            onPress={() => setSortBy('date')}
          >
            <Text style={styles.sortText}>Date</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.subheader}>Accepted</Text>
      {acceptedJobs.length === 0 ? (
        <Text style={styles.emptyText}>You have no accepted jobs.</Text>
      ) : (
        <FlatList
          data={acceptedJobs}
          keyExtractor={item => item.id}
          renderItem={renderJob}
          contentContainerStyle={styles.list}
        />
      )}

      <Text style={styles.subheader}>Completed</Text>
      {completedJobs.length === 0 ? (
        <Text style={styles.emptyText}>No jobs completed yet.</Text>
      ) : (
        <FlatList
          data={completedJobs}
          keyExtractor={item => item.id}
          renderItem={renderJob}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#008080' },
  subheader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  list: { paddingBottom: 30 },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  jobDescription: { fontSize: 14, color: '#333', marginTop: 4 },
  photo: { width: '100%', height: 160, borderRadius: 10, marginTop: 10 },
  emptyText: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 20 },
  urgencyBadge: {
    color: 'white',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
    overflow: 'hidden'
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sortButtons: { flexDirection: 'row', gap: 10 },
  sortOption: {
    backgroundColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  activeSort: {
    backgroundColor: '#008080'
  },
  sortText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
