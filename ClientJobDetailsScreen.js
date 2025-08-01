// ClientJobDetailsScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Button, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';

export default function ClientJobDetailsScreen({ route }) {
  const { job } = route.params;
  const navigation = useNavigation();
  const userId = auth.currentUser.uid;

  const isOwner = job.clientId === userId;
  const isAdmin = job.adminOverride === true;

  const handleEdit = () => {
    navigation.navigate('EditJobScreen', { job });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Job Request?',
      'Cancelling a job request will require admin approval and may delay your project.',
      [{ text: 'Dismiss' }, { text: 'Request Cancel', onPress: () => console.log('Cancel requested') }]
    );
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

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{job.jobAddress}</Text>
        <Text style={styles.value}>ZIP: {job.zip}</Text>

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
      </View>

      {(isOwner || isAdmin) && (
        <View style={styles.actions}>
          <Button title="Edit Job" onPress={handleEdit} />
          <View style={{ height: 12 }} />
          <Button color="#cc0000" title="Cancel Job" onPress={handleCancel} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 8 },
  status: { fontSize: 16, fontWeight: '500', color: '#666', marginBottom: 14 },
  photoRow: { marginBottom: 16 },
  photo: {
    width: 100, height: 100, borderRadius: 8,
    marginRight: 10,
  },
  section: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, color: '#333' },
  actions: { marginTop: 20 },
});
