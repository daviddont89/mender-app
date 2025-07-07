// ContractorJobsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ContractorJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);

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

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Assigned Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.status}</Text>
          </TouchableOpacity>
        )}
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
});
