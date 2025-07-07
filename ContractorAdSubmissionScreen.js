// ContractorAdSubmissionScreen.js

import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ContractorAdSubmissionScreen() {
  const [blurb, setBlurb] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitAd = async () => {
    if (!blurb) return Alert.alert('Missing', 'Please add a blurb');
    try {
      await setDoc(doc(db, 'contractorAds', auth.currentUser.uid), {
        blurb,
        image,
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Success', 'Ad submitted!');
      setBlurb('');
      setImage(null);
    } catch (err) {
      Alert.alert('Error', 'Could not submit ad');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Ad</Text>
      <TextInput
        placeholder="Your work style, specialties, or pitch to clients..."
        style={styles.input}
        multiline
        numberOfLines={4}
        value={blurb}
        onChangeText={setBlurb}
      />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <Button title="Pick Photo" onPress={pickImage} />
      <Button title="Submit Ad" onPress={submitAd} color="#008080" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});
