import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function JobDetailsScreen() {
  const route = useRoute();
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, 'jobs', jobId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob(docSnap.data());
        }
        const user = auth.currentUser;
        if (user) setUserId(user.uid);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  const isClient = userId === job.clientId;
  const isAssignedContractor = userId === job.contractorId;
  const showFullDetails = isClient || isAssignedContractor;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.urgency}>Urgency: {job.urgency || 'Normal'}</Text>

      {job.scheduledTime && (
        <Text style={styles.scheduledTime}>Scheduled: {job.scheduledTime}</Text>
      )}

      <Text style={styles.sectionHeader}>Description</Text>
      <Text style={styles.description}>{job.description}</Text>

      {showFullDetails && (
        <>
          {job.address && (
            <>
              <Text style={styles.sectionHeader}>Address</Text>
              <Text style={styles.detailText}>{job.address}</Text>
            </>
          )}

          {job.specialInstructions && (
            <>
              <Text style={styles.sectionHeader}>Instructions</Text>
              <Text style={styles.detailText}>{job.specialInstructions}</Text>
            </>
          )}
        </>
      )}

      {job.photos && job.photos.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Photos</Text>
          {job.photos.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  urgency: {
    fontSize: 16,
    color: '#f44336',
    marginBottom: 10,
  },
  scheduledTime: {
    fontSize: 16,
    color: '#00897b',
    marginBottom: 10,
  },
  sectionHeader: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
});
