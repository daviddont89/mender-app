// ContractorJobsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ContractorJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('contractorId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(list);
    } catch (e) {
      console.error('Fetch jobs error:', e);
    }
  };

  // Faux/test timeline data
  const getTimeline = (job) => [
    { status: 'Accepted', date: '2023-09-02', note: 'You accepted the job.' },
    { status: 'In Progress', date: '2023-09-03', note: 'Work started.' },
    { status: 'Completed', date: '2023-09-04', note: 'Job completed. Invoice sent.' },
  ];

  useEffect(() => {
    fetchJobs();
    // Add faux/test jobs for demo if empty
    if (jobs.length === 0) {
      setJobs([
        { id: 'cjob1', title: 'Deck Repair', description: 'Fix loose boards and re-stain deck.', status: 'In Progress', createdAt: { toDate: () => new Date('2023-09-10') } },
        { id: 'cjob2', title: 'Winterizing', description: 'Winterize outdoor faucets and check insulation.', status: 'Accepted', createdAt: { toDate: () => new Date('2023-10-01') } },
        { id: 'cjob3', title: 'Fence Painting', description: 'Paint backyard fence white.', status: 'Completed', createdAt: { toDate: () => new Date('2023-08-15') } },
      ]);
    }
  }, []);

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
      <Text style={styles.header}>My Assigned Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={renderJob}
      />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  status: {
    fontWeight: 'bold',
    color: '#008080',
  },
  date: {
    color: '#888',
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
