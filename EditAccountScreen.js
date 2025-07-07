// EditAccountScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function EditAccountScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || '');
        setPhone(data.phone || '');
        setRole(data.role || '');
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { name, phone, role });
      Alert.alert('Saved', 'Account updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update account.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Role (contractor/client)"
        value={role}
        onChangeText={setRole}
      />

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
