// JobDetailsScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { auth, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function JobDetailsScreen({ route, navigation }) {
  const { job } = route.params;
  const userId = auth.currentUser.uid;

  const isOwner = job.clientId === userId;
  const isContractor = job.contractorId === userId;
  const isUnclaimed = !job.contractorId;
  const isAdmin = job.adminOverride === true;

  const [incompleteReason, setIncompleteReason] = useState('');
  const [showIncompleteInput, setShowIncompleteInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateJobStatus = async (statusUpdate) => {
    setSubmitting(true);
    try {
      await updateDoc(doc(db, 'jobs', job.id), statusUpdate);
      Alert.alert('Success', 'Job status updated.');
      navigation.goBack();
    } catch (e) {
      console.error('Status Update Error:', e);
      Alert.alert('Error', 'Could not update job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = () => updateJobStatus({
    contractorId: userId,
    status: 'Accepted',
  });

  const handleStart = () => updateJobStatus({
    status: 'In Progress',
    startTime: new Date().toISOString(),
  });

  const handleComplete = () => updateJobStatus({
    status: 'Completed',
    endTime: new Date().toISOString(),
  });

  const handleIncomplete = () => {
    if (!incompleteReason.trim()) {
      return Alert.alert('Reason Required', 'Please enter a reason.');
    }
    updateJobStatus({
      status: 'Incomplete',
      incompleteReason,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{job.title}</Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.text}>{job.description}</Text>

      <Text style={styles.label}>Address</Text>
      <Text style={styles.text}>{job.jobAddress}</Text>

      <Text style={styles.label}>ZIP Code</Text>
      <Text style={styles.text}>{job.zip}</Text>

      <Text style={styles.label}>Urgency</Text>
      <Text style={styles.text}>{job.urgency}</Text>

      {job.flexibleWindow && (
        <>
          <Text style={styles.label}>Preferred Time Window</Text>
          <Text style={styles.text}>{job.flexibleWindow}</Text>
        </>
      )}

      {job.specialInstructions && (
        <>
          <Text style={styles.label}>Special Instructions</Text>
          <Text style={styles.text}>{job.specialInstructions}</Text>
        </>
      )}

      {job.photos?.length > 0 && (
        <>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photoContainer}>
            {job.photos.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.photo} />
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Status</Text>
      <Text style={styles.text}>{job.status}</Text>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        {isContractor && job.status === 'Open' && (
          <Button title="Accept Job" onPress={handleAccept} />
        )}

        {isContractor && job.status === 'Accepted' && (
          <Button title="Start Job" onPress={handleStart} />
        )}

        {isContractor && job.status === 'In Progress' && (
          <>
            <Button title="Complete Job" onPress={handleComplete} />
            <View style={{ marginVertical: 8 }} />
            <Button title="Mark Incomplete" onPress={() => setShowIncompleteInput(true)} />
          </>
        )}

        {showIncompleteInput && (
          <>
            <TextInput
              placeholder="Reason for marking job incomplete"
              value={incompleteReason}
              onChangeText={setIncompleteReason}
              style={styles.input}
              multiline
            />
            <Button title="Submit Incomplete" onPress={handleIncomplete} disabled={submitting} />
          </>
        )}

        {isOwner && job.status === 'Open' && (
          <>
            <View style={{ marginVertical: 8 }} />
            <Button
              title="Edit Job"
              onPress={() => navigation.navigate('EditJobScreen', { job })}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  photo: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonGroup: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
});
