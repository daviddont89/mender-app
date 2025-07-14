// CompleteJobScreen.js

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
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export default function CompleteJobScreen({ route, navigation }) {
  const { jobId } = route.params;

  const [photo, setPhoto] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async (type = 'photo') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      if (type === 'photo') setPhoto(result.assets[0].uri);
      if (type === 'receipt') setReceipts(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!photo || !notes.trim()) {
      Alert.alert('Missing Info', 'Please provide a photo and completion notes.');
      return;
    }

    Alert.alert('Complete Job', 'Submit final details and mark job as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: async () => {
          setLoading(true);
          try {
            await updateDoc(doc(db, 'jobs', jobId), {
              status: 'Completed',
              endTime: Timestamp.now(),
              completedNotes: notes,
              clientRating: rating ? parseInt(rating) : null,
              completionPhotos: [photo],
              receipts,
            });
            Alert.alert('Success', 'Job marked as completed.');
            navigation.goBack();
          } catch (err) {
            console.error('Completion error:', err);
            Alert.alert('Error', 'Could not complete job.');
          }
          setLoading(false);
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mark Job as Complete</Text>
      <Text style={styles.text}>Upload a photo, add notes, and submit receipts if needed.</Text>

      <Text style={styles.label}>Completed Job Photo:</Text>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <Button title="Upload Photo" onPress={() => pickImage('photo')} />
      )}

      <Text style={styles.label}>Completion Notes:</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Describe what was done..."
        value={notes}
        onChangeText={setNotes}
      />

      <Text style={styles.label}>Receipts (optional):</Text>
      <Button title="Upload Receipt" onPress={() => pickImage('receipt')} />
      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {receipts.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.receiptThumb} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Rate This Client:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={rating} onValueChange={setRating} style={styles.picker}>
          <Picker.Item label="Select Rating" value="" />
          <Picker.Item label="👍 Great to work with" value="5" />
          <Picker.Item label="👌 Fine / Neutral" value="3" />
          <Picker.Item label="👎 Would not work with again" value="1" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#008080" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Complete Job</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#008080', marginBottom: 10, textAlign: 'center' },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#444' },
  label: { fontWeight: '600', marginTop: 20, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  receiptThumb: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: { height: 50, width: '100%' },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
