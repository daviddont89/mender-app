import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export default function OpenJobsScreen() {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'jobs'));
        const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobList);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      {item.photos?.[0] && (
        <Image source={{ uri: item.photos[0] }} style={styles.image} />
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={jobs}
      keyExtractor={item => item.id}
      renderItem={renderJob}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
  },
  image: {
    marginTop: 10,
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
});
