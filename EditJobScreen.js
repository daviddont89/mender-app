// EditJobScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function EditJobScreen({ route, navigation }) {
  const { job } = route.params;

  const [title, setTitle] = useState(job.title || '');
  const [description, setDescription] = useState(job.description || '');
  const [jobAddress, setJobAddress] = useState(job.jobAddress || '');
  const [zip, setZip] = useState(job.zip || '');
  const [urgency, setUrgency] = useState(job.urgency || 'Normal');
  const [flexibleWindow, setFlexibleWindow] = useState(job.flexibleWindow || '');
  const [specialInstructions, setSpecialInstructions] = useState(job.specialInstructions || '');
  const [photos, setPhotos] = useState(job.photos || []);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true });
    if (!result.cancelled) {
      setPhotos([...photos, result.uri]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setPhotos([...photos, result.uri]);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleUpdate = async () => {
    if (!title || !description || !jobAddress || !zip) {
      Alert.alert('Missing Info', 'Please fill out all required fields.');
      return;
    }

    if (job.status !== 'Open') {
      Alert.alert('Locked', 'You can only edit jobs that are still open.');
      return;
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        title,
        description,
        jobAddress,
        zip,
        urgency,
        flexibleWindow: urgency === 'Flexible' ? flexibleWindow : null,
        specialInstructions,
        photos,
      });

      Alert.alert('Success', 'Job updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Could not update job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Job</Text>

      <TextInput
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Job Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <TextInput
        placeholder="Job Address"
        value={jobAddress}
        onChangeText={setJobAddress}
        style={styles.input}
      />

      <TextInput
        placeholder="ZIP Code"
        value={zip}
        onChangeText={setZip}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Urgency</Text>
      <Picker
        selectedValue={urgency}
        onValueChange={setUrgency}
        style={styles.picker}
      >
        <Picker.Item label="Emergency (+$20)" value="Emergency" />
        <Picker.Item label="Normal" value="Normal" />
        <Picker.Item label="Flexible Schedule" value="Flexible" />
      </Picker>

      {urgency === 'Flexible' && (
        <View>
          <Text style={styles.label}>Preferred Time Window</Text>
          <Picker
            selectedValue={flexibleWindow}
            onValueChange={setFlexibleWindow}
            style={styles.picker}
          >
            <Picker.Item label="Any day this week" value="Any day this week" />
            <Picker.Item label="Next weekend" value="Next weekend" />
            <Picker.Item label="After 5pm on weekdays" value="After 5pm on weekdays" />
            <Picker.Item label="Morning only (8am–12pm)" value="Morning only" />
          </Picker>
        </View>
      )}

      <TextInput
        placeholder="Special Instructions"
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <View style={styles.photoButtons}>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text style={styles.photoButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewContainer}>
        {photos.map((uri, index) => (
          <TouchableOpacity key={index} onLongPress={() => removePhoto(index)}>
            <Image source={{ uri }} style={styles.preview} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 10,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: '#008080',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
