// Screen 7: Post a Job (with Firestore)
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './firebase';

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const PostJobScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handlePostJob = async () => {
    if (!title || !description || !address) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    try {
      const user = auth.currentUser;
      const docRef = await addDoc(collection(db, 'jobs'), {
        title,
        description,
        address,
        instructions,
        imageURIs: images,
        status: 'pending',
        createdAt: serverTimestamp(),
        userId: user ? user.uid : null,
      });
      Alert.alert('Success', 'Job posted successfully!');
      setTitle('');
      setDescription('');
      setAddress('');
      setInstructions('');
      setImages([]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Post a Job</Text>

      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Job Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Address or Location"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Gate code, instructions, etc. (optional)"
        value={instructions}
        onChangeText={setInstructions}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#008080',
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('OpenJobs')}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>View Open Jobs</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handlePostJob}>
        <Text style={styles.buttonText}>Post Job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#004d4d',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#e0f7f7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#008080',
    fontWeight: '600',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostJobScreen;
