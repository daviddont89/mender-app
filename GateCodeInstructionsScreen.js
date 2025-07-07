// GateCodeInstructionsScreen.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function GateCodeInstructionsScreen({ route }) {
  const { jobId } = route.params;
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const docRef = doc(db, 'jobs', jobId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInstructions(docSnap.data().instructions || '');
        }
      } catch (err) {
        Alert.alert('Error', 'Could not load instructions');
      }
    };

    loadInstructions();
  }, []);

  const handleSave = async () => {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await setDoc(jobRef, { instructions }, { merge: true });
      Alert.alert('Saved', 'Instructions updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Could not save instructions');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gate Code / Special Instructions:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={5}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="e.g., Call on arrival. Gate code: 4567*"
      />
      <Button title="Save Instructions" onPress={handleSave} color="#008080" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});
