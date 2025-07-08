// ContractorHomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import JobCard from './components/JobCard';
import { useNavigation } from '@react-navigation/native';

export default function ContractorHomeScreen() {
  const navigation = useNavigation();
  const [openJobs, setOpenJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Open');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const jobsRef = collection(db, 'jobs');

      const openQuery = query(jobsRef, where('status', '==', 'Open'));
      const acceptedQuery = query(jobsRef, where('contractorId', '==', auth.currentUser.uid), where('status', 'in', ['Accepted', 'In Progress']));
      const completedQuery = query(jobsRef, where('contractorId', '==', auth.currentUser.uid), where('status', '==', 'Completed'));

      const [openSnap, acceptedSnap, completedSnap] = await Promise.all([
        getDocs(openQuery),
        getDocs(acceptedQuery),
        getDocs(completedQuery),
      ]);

      setOpenJobs(openSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setAcceptedJobs(acceptedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCompletedJobs(completedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error('Failed to load jobs:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const renderJobs = (jobs) => {
    if (!jobs.length) return <Text style={styles.empty}>No jobs to display.</Text>;

    return jobs.map(job => (
      <TouchableOpacity key={job.id} onPress={() => navigation.navigate('JobDetailsScreen', { job })}>
        <JobCard job={job} />
      </TouchableOpacity>
    ));
  };

  const renderSelectedTab = () => {
    switch (selectedTab) {
      case 'Open':
        return renderJobs(openJobs);
      case 'Accepted':
        return renderJobs(acceptedJobs);
      case 'Completed':
        return renderJobs(completedJobs);
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contractor Dashboard</Text>

      <View style={styles.tabContainer}>
        {['Open', 'Accepted', 'Completed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00aaff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {renderSelectedTab()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 15, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  scrollView: { paddingBottom: 80 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  tab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee' },
  activeTab: { backgroundColor: '#00aaff' },
  tabText: { fontSize: 16, color: '#333' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
});
