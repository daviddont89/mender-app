import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

export default function ClientJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const isFocused = useIsFocused();
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Faux/test timeline data
  const getTimeline = (job) => [
    { status: 'Open', date: '2023-09-01', note: 'Job posted.' },
    { status: 'Accepted', date: '2023-09-02', note: 'Contractor accepted.' },
    { status: 'In Progress', date: '2023-09-03', note: 'Work started.' },
    { status: 'Completed', date: '2023-09-04', note: 'Job completed. Invoice sent.' },
  ];

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
    // Add faux/test jobs for demo if empty
    if (jobs.length === 0) {
      setJobs([
        { id: 'demo1', title: 'Gutter Cleaning', description: 'Clean all gutters and downspouts.', status: 'Completed', createdAt: { toDate: () => new Date('2023-09-01') } },
        { id: 'demo2', title: 'Deck Repair', description: 'Fix loose boards and re-stain deck.', status: 'In Progress', createdAt: { toDate: () => new Date('2023-09-10') } },
        { id: 'demo3', title: 'Winterizing', description: 'Winterize outdoor faucets and check insulation.', status: 'Open', createdAt: { toDate: () => new Date('2023-10-01') } },
      ]);
    }
  }, [isFocused]);

  const renderJob = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
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
      <TouchableOpacity style={styles.timelineBtn} onPress={() => setExpandedJobId(expandedJobId === item.id ? null : item.id)}>
        <Text style={styles.timelineBtnText}>{expandedJobId === item.id ? 'Hide Timeline' : 'Show Timeline'}</Text>
      </TouchableOpacity>
      {expandedJobId === item.id && (
        <View style={styles.timelineContainer}>
          {getTimeline(item).map((t, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <Text style={styles.timelineStatus}>{t.status}</Text>
              <Text style={styles.timelineDate}>{t.date}</Text>
              <Text style={styles.timelineNote}>{t.note}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Jobs</Text>
      {jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('./assets/clipboard.png')} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Jobs Yet</Text>
          <Text style={styles.emptyMsg}>You haven’t posted any jobs yet. Tap below to get started!</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('PostJobScreen')}>
            <Text style={styles.emptyBtnText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    width: 70, height: 70, marginBottom: 16, opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#008080', marginBottom: 6,
  },
  emptyMsg: {
    color: '#555', fontSize: 15, marginBottom: 18, textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: '#008080', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8,
  },
  emptyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
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
  timelineBtn: {
    marginTop: 8, alignSelf: 'flex-end', backgroundColor: '#e0f7f5', padding: 6, borderRadius: 6,
  },
  timelineBtnText: { color: '#008080', fontWeight: 'bold', fontSize: 14 },
  timelineContainer: { marginTop: 10, backgroundColor: '#f4f4f4', borderRadius: 8, padding: 10 },
  timelineItem: { marginBottom: 8 },
  timelineStatus: { fontWeight: 'bold', color: '#008080' },
  timelineDate: { color: '#888', fontSize: 13 },
  timelineNote: { color: '#444', fontSize: 14 },
});
