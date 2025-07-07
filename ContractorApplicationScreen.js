// ContractorApplicationScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ContractorApplicationScreen() {
  const [form, setForm] = useState({
    name: '',
    city: '',
    skills: '',
    phone: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { name, city, skills, phone } = form;
    if (!name || !city || !skills || !phone) {
      return Alert.alert('Incomplete', 'Please fill out all fields');
    }

    try {
      await setDoc(doc(db, 'contractorApplications', auth.currentUser.uid), {
        ...form,
        submittedAt: new Date().toISOString(),
      });
      Alert.alert('Submitted', 'Your application has been received!');
    } catch (err) {
      Alert.alert('Error', 'Could not submit application');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contractor Application</Text>
      {['name', 'city', 'skills', 'phone'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChangeText={(val) => handleChange(field, val)}
        />
      ))}
      <Button title="Submit Application" onPress={handleSubmit} color="#008080" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
});
