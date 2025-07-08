import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Open');

  useEffect(() => {
    loadJobs();
    const timer = setTimeout(() => setTimeoutReached(true), 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);

  const loadJobs = async () => {
    try {
      const jobsRef = collection(db, 'jobs');

      const openQuery = query(jobsRef, where('status', '==', 'Open'));
      const acceptedQuery = query(
        jobsRef,
        where('contractorId', '==', auth.currentUser.uid),
        where('status', 'in', ['Accepted', 'In Progress'])
      );
      const completedQuery = query(
        jobsRef,
        where('contractorId', '==', auth.currentUser.uid),
        where('status', '==', 'Completed')
      );

      const [openSnap, acceptedSnap, completedSnap] = await Promise.all([
        getDocs(openQuery),
        getDocs(acceptedQuery),
        getDocs(completedQuery),
      ]);

      setOpenJobs(openSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setAcceptedJobs(acceptedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCompletedJobs(completedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentJobs = () => {
    if (selectedTab === 'Open') return openJobs;
    if (selectedTab === 'Accepted') return acceptedJobs;
    return completedJobs;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {['Open', 'Accepted', 'Completed'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
            <Text style={[styles.tab, selectedTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#007b7f" />
        </View>
      ) : getCurrentJobs().length === 0 && timeoutReached ? (
        <Text style={styles.noJobsText}>No more jobs loaded.</Text>
      ) : (
        <ScrollView style={styles.scroll}>
          {getCurrentJobs().map((job) => (
            <JobCard key={job.id} job={job} navigation={navigation} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  tab: {
    fontSize: 16,
    color: '#444',
    paddingBottom: 4,
  },
  activeTab: {
    fontWeight: 'bold',
    color: '#007b7f',
    borderBottomWidth: 2,
    borderBottomColor: '#007b7f',
  },
  scroll: { marginTop: 10 },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noJobsText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});
