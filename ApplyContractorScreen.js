// ApplyContractorScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import firebaseApp from './firebase';

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default function ApplyContractorScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');

  const handleApply = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Not logged in', 'You must be logged in to apply.');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        role: 'contractor',
        contractorApplication: {
          fullName,
          skills,
          experience,
          availability,
          submittedAt: new Date(),
        },
      });

      Alert.alert('Application Submitted', 'Your request to become a contractor has been received.');
      navigation.navigate('ContractorDrawer');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was an error submitting your application.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Apply to Become a Contractor</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        placeholder="Skills (e.g. plumbing, electrical)"
        style={styles.input}
        value={skills}
        onChangeText={setSkills}
      />

      <TextInput
        placeholder="Experience (years or description)"
        style={styles.input}
        value={experience}
        onChangeText={setExperience}
      />

      <TextInput
        placeholder="Availability (days/hours)"
        style={styles.input}
        value={availability}
        onChangeText={setAvailability}
      />

      <TouchableOpacity style={styles.button} onPress={handleApply}>
        <Text style={styles.buttonText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#007C91',
    padding: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
