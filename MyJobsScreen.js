import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function MyJobsScreen() {
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('urgency');
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
          getDocs(completedQuery),
        ]);

        const sortJobs = (jobs) => {
          return jobs.sort((a, b) => {
            if (sortBy === 'urgency') {
              return (b.urgencyLevel || 0) - (a.urgencyLevel || 0);
            } else {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
          });
        };

        const acceptedData = sortJobs(
          acceptedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const completedData = sortJobs(
          completedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        setAcceptedJobs(acceptedData);
        setCompletedJobs(completedData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [sortBy]);

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetailsScreen', { job: item })}
    >
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={{ marginTop: 12 }}>Loading your jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Jobs</Text>

      <Text style={styles.sectionTitle}>Accepted Jobs</Text>
      {acceptedJobs.length > 0 ? (
        <FlatList
          data={acceptedJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        />
      ) : (
        <Text style={styles.emptyText}>No accepted jobs right now.</Text>
      )}

      <Text style={styles.sectionTitle}>Completed Jobs</Text>
      {completedJobs.length > 0 ? (
        <FlatList
          data={completedJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
        />
      ) : (
        <Text style={styles.emptyText}>No completed jobs yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 8,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
  },
  cardContent: {
    padding: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 12,
  },
});
