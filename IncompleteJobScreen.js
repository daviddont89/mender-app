import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { doc, updateDoc, Timestamp, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const REASON_OPTIONS = [
  'Client not home',
  'Unable to access site',
  'Job scope changed',
  'Safety concern',
  'Materials unavailable',
  'Payment issue',
  'Weather conditions',
];

export default function IncompleteJobScreen({ route, navigation }) {
  const { jobId } = route.params;
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (text) => {
    setSelectedReason(text);
    setReason('');
  };

  const handleSubmit = async () => {
    const finalReason = reason.trim() || selectedReason;
    if (!finalReason) {
      Alert.alert('Missing Info', 'Please select or enter a reason.');
      return;
    }

    Alert.alert('Send Back to Client', 'This will revert the job to draft and notify the client.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setLoading(true);
          try {
            await updateDoc(doc(db, 'jobs', jobId), {
              status: 'Draft',
              incompleteReason: finalReason,
              endTime: Timestamp.now(),
              returnedToClient: true,
            });

            await addDoc(collection(db, 'jobFlags'), {
              jobId,
              reason: finalReason,
              flaggedBy: 'contractor',
              createdAt: Timestamp.now(),
              read: false,
            });

            Alert.alert('Job Sent Back', 'Client and admin have been notified.');
            navigation.goBack();
          } catch (err) {
            console.error('Error:', err);
            Alert.alert('Error', 'Could not update job.');
          }
          setLoading(false);
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mark Job as Incomplete</Text>
      <Text style={styles.text}>Why couldn’t the job be completed?</Text>

      {REASON_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.option, selectedReason === opt && styles.optionSelected]}
          onPress={() => handleSelect(opt)}
        >
          <Text style={[styles.optionText, selectedReason === opt && styles.optionTextSelected]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Other Reason:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter custom reason..."
        value={reason}
        onChangeText={setReason}
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : (
        <Button title="Submit Reason" color="#008080" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#008080', marginBottom: 10, textAlign: 'center' },
  text: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 20 },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  optionSelected: {
    borderColor: '#008080',
    backgroundColor: '#e0f7f7',
  },
  optionText: { fontSize: 16, color: '#333' },
  optionTextSelected: { color: '#008080', fontWeight: '600' },
  label: { fontWeight: '600', marginTop: 20, marginBottom: 6, color: '#333' },
  input: {
    minHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});
