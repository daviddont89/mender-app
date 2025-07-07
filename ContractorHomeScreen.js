// 🔒 LOCKED FILE — DO NOT EDIT, FIX, OR REPLACE
// ContractorHomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import JobCard from './components/JobCard';

export default function ContractorHomeScreen() {
  const [openJobs, setOpenJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const openQuery = query(collection(db, 'jobs'), where('status', '==', 'Open'));
      const myQuery = query(collection(db, 'jobs'), where('contractorId', '==', auth.currentUser.uid));

      const [openSnap, mySnap] = await Promise.all([getDocs(openQuery), getDocs(myQuery)]);

      setOpenJobs(openSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMyJobs(mySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Jobs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : (
        <>
          <Text style={styles.section}>Jobs In Progress</Text>
          {myJobs.filter(j => j.status === 'In Progress').map(job => (
            <JobCard key={job.id} job={job} />
          ))}

          <Text style={styles.section}>Completed Jobs</Text>
          {myJobs.filter(j => j.status === 'Completed').map(job => (
            <JobCard key={job.id} job={job} />
          ))}

          <Text style={styles.section}>Available Jobs</Text>
          {openJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </>
      )}
    </ScrollView>
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
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
    color: '#333',
  },
});
