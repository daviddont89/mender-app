// ContractorJobDetailsScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Button, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ContractorJobDetailsScreen({ route }) {
  const { job } = route.params;
  const userId = auth.currentUser.uid;
  const navigation = useNavigation();

  const isAcceptedByThisContractor = job.contractorId === userId;
  const isUnclaimed = !job.contractorId;

  const handleAccept = async () => {
    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        contractorId: userId,
        status: 'Accepted',
      });
      Alert.alert('Job Accepted', 'You have claimed this job.');
      navigation.goBack();
    } catch (e) {
      console.error('Accept Error:', e);
      Alert.alert('Error', 'Unable to accept job.');
    }
  };

  const handleDecline = () => {
    Alert.alert('Not Implemented', 'Decline job logic to be added.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.status}>Status: {job.status}</Text>

      {job.photos?.length > 0 && (
        <ScrollView horizontal style={styles.photoRow}>
          {job.photos.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.photo} />
          ))}
        </ScrollView>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{job.description}</Text>

        <Text style={styles.label}>Urgency</Text>
        <Text style={styles.value}>{job.urgency}</Text>

        {job.flexibleWindow && (
          <>
            <Text style={styles.label}>Preferred Time</Text>
            <Text style={styles.value}>{job.flexibleWindow}</Text>
          </>
        )}

        {job.specialInstructions && (
          <>
            <Text style={styles.label}>Special Instructions</Text>
            <Text style={styles.value}>{job.specialInstructions}</Text>
          </>
        )}

        {isAcceptedByThisContractor && (
          <>
            <Text style={styles.label}>Job Address</Text>
            <Text style={styles.value}>{job.jobAddress}</Text>
            <Text style={styles.value}>ZIP: {job.zip}</Text>
          </>
        )}
      </View>

      {isUnclaimed && (
        <View style={styles.actions}>
          <Button title="Accept Job" onPress={handleAccept} />
          <View style={{ height: 10 }} />
          <Button title="Decline Job" color="#999" onPress={handleDecline} />
        </View>
      )}

      {isAcceptedByThisContractor && (
        <Text style={styles.note}>✅ You've accepted this job.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 8 },
  status: { fontSize: 16, fontWeight: '500', color: '#666', marginBottom: 14 },
  photoRow: { marginBottom: 16 },
  photo: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  section: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, color: '#333' },
  actions: { marginTop: 20 },
  note: { color: '#008000', marginTop: 20, fontWeight: '600' },
});
