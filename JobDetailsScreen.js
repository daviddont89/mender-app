import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, ActivityIndicator } from 'react-native';
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#008080" style={styles.loader} />;
  }

  if (!job) {
    return <Text style={styles.errorText}>Job not found</Text>;
  }

  const isClient = userId === job.clientId;
  const isAssignedContractor = userId === job.contractorId;
  const showFullDetails = isClient || isAssignedContractor;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.urgency}>Urgency: {job.urgency || 'Normal'}</Text>
      {job.scheduledTime && (
        <Text style={styles.scheduled}>Scheduled: {job.scheduledTime}</Text>
      )}
      <Text style={styles.description}>{job.description}</Text>

      {job.photos?.length > 0 &&
        job.photos.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}

      {showFullDetails && (
        <>
          <Text style={styles.details}>Address: {job.address || 'N/A'}</Text>
          <Text style={styles.details}>Gate Code: {job.gateCode || 'N/A'}</Text>
          <Text style={styles.details}>Special Instructions: {job.instructions || 'None'}</Text>
          <Text style={styles.details}>Client Contact: {job.clientName} ({job.clientPhone})</Text>
        </>
      )}

      {!isAssignedContractor && !isClient && (
        <Button
          title="Accept Job"
          onPress={() => {
            // handle acceptance logic
            console.log('Accept button pressed');
          }}
          color="#008080"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
    fontFamily: 'MenderFont',
  },
  urgency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4500',
    marginBottom: 5,
  },
  scheduled: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  errorText: {
    marginTop: 50,
    textAlign: 'center',
    color: 'red',
  },
});
