// ClientJobDetailsScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ClientJobDetailsScreen() {
  const route = useRoute();
  const { job } = route.params;

  const handleCancel = () => Alert.alert('Job Canceled', 'Job has been canceled (placeholder).');
  const handleComplete = () => Alert.alert('Job Completed', 'Job marked as completed.');
  const handleRemoveContractor = () => Alert.alert('Contractor Removed', 'You may now assign a new one.');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>{job.description}</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.text}>{job.city}, {job.zip}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.text}>{job.status}</Text>

      <View style={styles.buttons}>
        <Button title="Mark as Complete" onPress={handleComplete} />
        <Button title="Cancel Job" onPress={handleCancel} color="orange" />
        <Button title="Remove Contractor" onPress={handleRemoveContractor} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  label: { fontWeight: 'bold', marginTop: 10 },
  text: { fontSize: 14 },
  buttons: { marginTop: 20, gap: 10 },
});
