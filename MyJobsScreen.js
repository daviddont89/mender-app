// MyJobsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function MyJobsScreen() {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchJobs = async () => {
      const userId = auth.currentUser.uid;
      const userQuery = query(
        collection(db, 'jobs'),
        where('createdBy', '==', userId)
      );
      const contractorQuery = query(
        collection(db, 'jobs'),
        where('contractorId', '==', userId)
      );

      const userSnap = await getDocs(userQuery);
      const contractorSnap = await getDocs(contractorQuery);

      const allJobs = [...userSnap.docs, ...contractorSnap.docs].map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const uniqueJobs = Array.from(
        new Map(allJobs.map(job => [job.id, job])).values()
      );

      setJobs(uniqueJobs);
    };

    fetchJobs();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No jobs found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#555' },
});
