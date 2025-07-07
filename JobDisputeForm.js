// JobDisputeForm.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function JobDisputeForm({ route, navigation }) {
  const { jobId } = route.params;
  const [reason, setReason] = useState('');

  const submitDispute = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason for the dispute');
      return;
    }

    try {
      await addDoc(collection(db, 'jobDisputes'), {
        jobId,
        contractorId: auth.currentUser.uid,
        reason,
        status: 'pending',
        submittedAt: new Date(),
      });
      Alert.alert('Success', 'Dispute submitted');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not submit dispute');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispute Job Outcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your reason"
        multiline
        numberOfLines={6}
        value={reason}
        onChangeText={setReason}
      />
      <Button title="Submit Dispute" color="#008080" onPress={submitDispute} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
});
