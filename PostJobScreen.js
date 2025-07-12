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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function PostJobScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zip, setZip] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [gateCode, setGateCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !zip) {
      Alert.alert('Missing Info', 'Please fill out the title, description, and ZIP code.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        description,
        zip,
        imageURL,
        urgency,
        gateCode,
        specialInstructions,
        status: 'Open',
        clientId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
      });

      Alert.alert('Success', 'Your job was posted.');
      navigation.replace('ClientJobScreen');
    } catch (error) {
      console.error('Error posting job:', error);
      Alert.alert('Error', 'Could not post job. Try again later.');
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Post a New Job</Text>

      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="ZIP Code"
        keyboardType="numeric"
        value={zip}
        onChangeText={setZip}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL (optional)"
        value={imageURL}
        onChangeText={setImageURL}
      />

      <Text style={styles.label}>Urgency</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={urgency}
          onValueChange={(value) => setUrgency(value)}
          style={styles.picker}
        >
          <Picker.Item label="Normal" value="Normal" />
          <Picker.Item label="Flexible (schedule around you)" value="Flexible" />
          <Picker.Item label="Emergency (+$20)" value="Emergency" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Gate Code (if any)"
        value={gateCode}
        onChangeText={setGateCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Special Instructions"
        multiline
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Post Job</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
