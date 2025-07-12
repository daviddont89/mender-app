import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export default function StartJobScreen({ route, navigation }) {
  const { jobId, job } = route.params;
  const [startTime, setStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load stored start time if it exists
  useEffect(() => {
    const loadTimer = async () => {
      const storedStart = await AsyncStorage.getItem(`job_${jobId}_start`);
      if (storedStart) {
        setStartTime(new Date(storedStart));
        setIsRunning(true);
      }
    };
    loadTimer();
  }, []);

  const handleStart = async () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    await AsyncStorage.setItem(`job_${jobId}_start`, now.toISOString());
    Alert.alert('Timer Started', 'Job timer has started.');
  };

  const handleStop = async () => {
    if (!startTime) return;

    const now = new Date();
    const elapsedMs = now - new Date(startTime);
    let totalMinutes = Math.ceil(elapsedMs / (1000 * 60));
    const roundedMinutes = Math.max(Math.ceil(totalMinutes / 15) * 15, 60);

    setLoading(true);

    const isOnline = await NetInfo.fetch().then(state => state.isConnected);

    if (!isOnline) {
      Alert.alert('Offline', 'You are currently offline. Job data will not be saved to server.');
      setLoading(false);
      return;
    }

    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: 'Completed',
        startTime: Timestamp.fromDate(new Date(startTime)),
        endTime: Timestamp.fromDate(now),
        totalMinutes: roundedMinutes,
      });

      await AsyncStorage.removeItem(`job_${jobId}_start`);
      Alert.alert('Success', `Job completed and logged (${roundedMinutes} minutes).`);
      navigation.goBack();
    } catch (err) {
      console.error('Stop error:', err);
      Alert.alert('Error', 'Failed to save job data.');
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Start This Job</Text>
      <Text style={styles.text}>
        Tap below when you're ready to begin. This will start the job timer.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : isRunning ? (
        <Button title="Stop & Complete Job" color="#008080" onPress={handleStop} />
      ) : (
        <Button title="Start Job Timer" color="#008080" onPress={handleStart} />
      )}

      <View style={styles.jobDetailsBox}>
        <Text style={styles.label}>Job Title:</Text>
        <Text style={styles.value}>{job?.title}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{job?.description}</Text>

        <Text style={styles.label}>Urgency:</Text>
        <Text style={styles.value}>{job?.urgency}</Text>

        <Text style={styles.label}>ZIP:</Text>
        <Text style={styles.value}>{job?.zip}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{job?.status}</Text>
      </View>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('JobDetailsScreen', { job })}
      >
        <Text style={styles.detailsText}>View Full Job Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#444',
  },
  jobDetailsBox: {
    width: '100%',
    marginTop: 30,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  value: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  detailsButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  detailsText: {
    color: '#008080',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
