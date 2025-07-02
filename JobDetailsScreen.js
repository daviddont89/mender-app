// JobDetailsScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
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
    navigation.goBack();
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

      <View style={styles.detailsBox}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{job.location || 'N/A'}</Text>

        <Text style={styles.label}>Scheduled Date/Time:</Text>
        <Text style={styles.value}>
          {job.date || 'Unscheduled'} {job.timeWindow ? `from ${job.timeWindow}` : ''}
        </Text>

        <Text style={styles.label}>Contact Info:</Text>
        <Text style={styles.value}>{job.contact || 'N/A'}</Text>

        <Text style={styles.label}>Gate Code:</Text>
        <Text style={styles.value}>{job.gateCode || 'N/A'}</Text>

        <Text style={styles.label}>Special Instructions:</Text>
        <Text style={styles.value}>{job.instructions || 'None'}</Text>
      </View>

      {user && !isClient && (
        <View style={styles.buttonGroup}>
          {showAcceptDecline && (
            <>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.buttonText}>Accept Job</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </>
          )}
          {job.status === 'accepted' && isAssignedToUser && (
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.buttonText}>Mark as Completed</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'MenderFont', // Make sure this font is loaded
    color: 'black',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 12,
  },
  detailsBox: {
    backgroundColor: '#e0f7f7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#008080',
  },
  value: {
    color: '#000',
    marginBottom: 6,
  },
  buttonGroup: {
    marginTop: 16,
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#008080',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#999',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#006666',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
