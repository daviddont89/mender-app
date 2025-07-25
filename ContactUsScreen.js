// ContactUsScreen.js

import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
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
      Alert.alert('Thank You', 'Your message has been sent! Our team will get back to you soon.');
      setSubject('');
      setMessage('');
    } catch (err) {
      Alert.alert('Error', 'Could not send message.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./Icons/handshake.png')} style={styles.icon} />
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.positive}>We're here to help! Send us a message and our friendly team will respond ASAP. 😊</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  icon: { width: 70, height: 70, marginBottom: 10, marginTop: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 8 },
  positive: { color: '#008080', fontSize: 15, marginBottom: 18, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    marginBottom: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
