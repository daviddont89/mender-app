// PostJobScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export default function PostJobScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zip, setZip] = useState('');
  const [imageURL, setImageURL] = useState('');

  const handleSubmit = async () => {
    if (!title || !description || !zip) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        description,
        zip,
        imageURL,
        status: 'Open',
        clientId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
      });
      Alert.alert('Success', 'Job posted!');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting job:', error);
      Alert.alert('Error', 'Could not post job.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Post a New Job</Text>

      <TextInput style={styles.input} placeholder="Job Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" multiline value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="ZIP Code" keyboardType="numeric" value={zip} onChangeText={setZip} />
      <TextInput style={styles.input} placeholder="Image URL (optional)" value={imageURL} onChangeText={setImageURL} />

      <Button title="Post Job" onPress={handleSubmit} color="#008080" />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#008080',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
});
