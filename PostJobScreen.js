// PostJobScreen.js

import React, { useState } from 'react';
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
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function PostJobScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobAddress, setJobAddress] = useState('');
  const [zip, setZip] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [flexibleWindow, setFlexibleWindow] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

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

  const handleSubmit = async () => {
    if (!title || !description || !jobAddress || !zip) {
      Alert.alert('Missing Info', 'Please fill out the title, description, address, and ZIP code.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        description,
        jobAddress,
        zip,
        urgency,
        flexibleWindow: urgency === 'Flexible' ? flexibleWindow : null,
        specialInstructions,
        status: 'Open',
        clientId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
        photos,
      });

      Alert.alert('Success', 'Your job was posted.');
      navigation.replace('ClientJobScreen');
    } catch (error) {
      console.error('Error posting job:', error);
      Alert.alert('Error', 'Could not post your job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Post a Job</Text>

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
        onValueChange={value => setUrgency(value)}
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
            onValueChange={value => setFlexibleWindow(value)}
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
        placeholder="Special Instructions (e.g. gate code, pets, etc.)"
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
          <Image key={index} source={{ uri }} style={styles.preview} />
        ))}
      </View>

      <Text style={styles.expectations}>
        Once you post your job, a contractor will review and accept it. You'll receive photo updates,
        real-time progress, and a full invoice when the job is complete.
      </Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Post Job</Text>
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
  expectations: {
    fontSize: 14,
    color: '#555',
    marginVertical: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
