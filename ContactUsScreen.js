// ContactUsScreen.js

import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ContactUsScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!subject || !message) {
      return Alert.alert('Missing Info', 'Please fill out both fields.');
    }

    try {
      await addDoc(collection(db, 'supportMessages'), {
        userId: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || 'unknown',
        subject,
        message,
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Thank You', 'Your message has been sent.');
      setSubject('');
      setMessage('');
    } catch (err) {
      Alert.alert('Error', 'Could not send message.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Your Message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={handleSubmit} color="#008080" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
});
