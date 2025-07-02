import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PostJobScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newUri = result.assets?.[0]?.uri || result.uri;
      setMedia([...media, newUri]);
    }
  };

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert('Missing Fields', 'Please enter both title and description.');
      return;
    }

    // Submit logic (to be replaced with Firebase integration)
    console.log('Job submitted:', { title, description, media });
    Alert.alert('Success', 'Your job has been posted!');
    setTitle('');
    setDescription('');
    setMedia([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Post a Job</Text>

      <Text style={styles.label}>Job Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter job title"
        style={styles.input}
      />

      <Text style={styles.label}>Job Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter job description"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickMedia}>
        <Text style={styles.uploadText}>Upload Photos or Videos</Text>
      </TouchableOpacity>

      <View style={styles.mediaContainer}>
        {media.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.mediaPreview} />
        ))}
      </View>

      <Button title="Submit Job" onPress={handleSubmit} color="#00bcd4" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#00bcd4',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
});
