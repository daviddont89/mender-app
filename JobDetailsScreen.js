// JobDetailsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export default function JobDetailsScreen() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const jobId = route.params?.jobId;

  const user = auth.currentUser;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleAccept = async () => {
    try {
      const jobRef = doc(db, 'jobs', job.id);
      await updateDoc(jobRef, {
        status: 'accepted',
        contractorId: user.uid,
        contractorEmail: user.email
      });
      setJob(prev => ({
        ...prev,
        status: 'accepted',
        contractorId: user.uid,
        contractorEmail: user.email
      }));
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const handleDecline = () => {
    navigation.goBack(); // Or navigate to Open Jobs screen
  };

  const handleComplete = async () => {
    try {
      const jobRef = doc(db, 'jobs', job.id);
      await updateDoc(jobRef, { status: 'completed' });
      setJob(prev => ({ ...prev, status: 'completed' }));
    } catch (error) {
      console.error('Error completing job:', error);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  const showAcceptDecline = job.status !== 'accepted';
  const isAssignedToUser = job.contractorId === user?.uid;
  const isClient = job.clientId === user?.uid;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.description}>{job.description}</Text>

      {job.photos?.map((uri, idx) => (
        <Image key={idx} source={{ uri }} style={styles.image} />
      ))}

      <View style={styles.details}>
        <Text style={styles.label}>Location:</Text>
        <Text>{job.location}</Text>
        <Text style={styles.label}>Contact Info:</Text>
        <Text>{job.contact}</Text>
      </View>

      {/* Show buttons based on job state */}
      {user && !isClient && (
        <View style={styles.buttonGroup}>
          {showAcceptDecline && (
            <>
              <Button title="Accept Job" onPress={handleAccept} color="#008080" />
              <Button title="Decline" onPress={handleDecline} color="gray" />
            </>
          )}
          {job.status === 'accepted' && isAssignedToUser && (
            <Button title="Complete Job" onPress={handleComplete} color="#008080" />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'black', marginBottom: 10 },
  description: { fontSize: 16, color: '#333', marginBottom: 10 },
  image: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10, borderRadius: 10 },
  details: { marginTop: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  buttonGroup: { marginTop: 20, gap: 10 }
});
