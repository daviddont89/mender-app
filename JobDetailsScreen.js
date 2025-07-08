// JobDetailsScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ScrollView, TextInput } from 'react-native';
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
  const [submittingIncomplete, setSubmittingIncomplete] = useState(false);

  const updateJobStatus = async (statusUpdate) => {
    try {
      await updateDoc(doc(db, 'jobs', job.id), statusUpdate);
      Alert.alert('Success', 'Job status updated.');
      navigation.goBack();
    } catch (e) {
      console.error('Status Update Error:', e);
      Alert.alert('Error', 'Could not update job.');
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
      return Alert.alert('Reason required', 'Please enter a reason for marking incomplete.');
    }
    setSubmittingIncomplete(true);
    updateJobStatus({
      status: 'Incomplete',
      incompleteReason,
    }).finally(() => {
      setSubmittingIncomplete(false);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>{job.description}</Text>

      {job.photos?.length > 0 && (
        <View style={styles.imageContainer}>
          {job.photos.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </View>
      )}

      <Text style={styles.label}>Client Zip:</Text>
      <Text style={styles.text}>{job.zipCode}</Text>

      <Text style={styles.label}>Urgency:</Text>
      <Text style={styles.text}>{job.urgency}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text style={styles.text}>{job.status}</Text>

      {/* Role-based buttons */}
      {(isContractor && job.status === 'Accepted') && (
        <Button title="Start Job" onPress={handleStart} />
      )}
      {(isContractor && job.status === 'In Progress') && (
        <>
          <Button title="Complete Job" onPress={handleComplete} />
          <TextInput
            style={styles.input}
            placeholder="Reason for incomplete (if needed)"
            value={incompleteReason}
            onChangeText={setIncompleteReason}
          />
          <Button
            title={submittingIncomplete ? 'Submitting...' : 'Mark as Incomplete'}
            onPress={handleIncomplete}
            disabled={submittingIncomplete}
          />
        </>
      )}
      {(isUnclaimed && !isOwner) && (
        <Button title="Accept Job" onPress={handleAccept} />
      )}
      {(isOwner || isAdmin) && (
        <Text style={styles.note}>You can edit or cancel this job from your job list.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  label: { fontWeight: '600', marginTop: 10 },
  text: { marginBottom: 8 },
  imageContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  image: { width: 100, height: 100, marginRight: 10, marginBottom: 10 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
  note: {
    marginTop: 20,
    fontStyle: 'italic',
    color: 'gray',
  },
});
