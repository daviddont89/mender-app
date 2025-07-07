// JobDetailsScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ScrollView } from 'react-native';
import { auth, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function JobDetailsScreen({ route, navigation }) {
  const { job } = route.params;
  const isOwner = job.clientId === auth.currentUser.uid;
  const isContractor = !isOwner;

  const handleAccept = async () => {
    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        contractorId: auth.currentUser.uid,
        status: 'Accepted',
      });
      Alert.alert('Job Accepted');
      navigation.goBack();
    } catch (e) {
      console.error('Accept Error:', e);
      Alert.alert('Error', 'Could not accept job');
    }
  };

  const handleStart = async () => {
    try {
      await updateDoc(doc(db, 'jobs', job.id), { status: 'In Progress' });
      Alert.alert('Job Started');
      navigation.goBack();
    } catch (e) {
      console.error('Start Error:', e);
    }
  };

  const handleComplete = async () => {
    try {
      await updateDoc(doc(db, 'jobs', job.id), { status: 'Completed' });
      Alert.alert('Job Completed');
      navigation.goBack();
    } catch (e) {
      console.error('Complete Error:', e);
    }
  };

  const handleIncomplete = async () => {
    try {
      await updateDoc(doc(db, 'jobs', job.id), { status: 'Incomplete' });
      Alert.alert('Marked Incomplete');
      navigation.goBack();
    } catch (e) {
      console.error('Incomplete Error:', e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.desc}>{job.description}</Text>
      <Text style={styles.zip}>ZIP Code: {job.zip}</Text>
      {job.imageURL && <Image source={{ uri: job.imageURL }} style={styles.image} />}

      {isContractor && job.status === 'Open' && (
        <Button title="Accept Job" onPress={handleAccept} color="#008080" />
      )}
      {isContractor && job.status === 'Accepted' && (
        <Button title="Start Job" onPress={handleStart} color="#008080" />
      )}
      {isContractor && job.status === 'In Progress' && (
        <>
          <Button title="Complete Job" onPress={handleComplete} color="#006400" />
          <View style={{ height: 10 }} />
          <Button title="Mark Incomplete" onPress={handleIncomplete} color="#8B0000" />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    marginBottom: 10,
  },
  zip: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    marginBottom: 20,
  },
});
