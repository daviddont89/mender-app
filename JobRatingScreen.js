// JobRatingScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function JobRatingScreen({ route }) {
  const { jobId, userRole } = route.params;
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    if (!rating || isNaN(rating) || rating < 1 || rating > 10) {
      return Alert.alert('Error', 'Please enter a rating from 1 to 10');
    }

    try {
      await setDoc(
        doc(db, 'ratings', `${jobId}_${auth.currentUser.uid}`),
        {
          jobId,
          userId: auth.currentUser.uid,
          userRole,
          rating: parseInt(rating),
          feedback,
          timestamp: new Date().toISOString(),
        }
      );
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
    } catch (err) {
      Alert.alert('Error', 'Could not submit rating');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave a Rating</Text>
      <Text style={styles.label}>Rate the experience (1–10):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <Text style={styles.label}>Optional Feedback:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={feedback}
        onChangeText={setFeedback}
        placeholder="What went well? Anything to improve?"
      />
      <Button title="Submit Rating" onPress={handleSubmit} color="#008080" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  label: { marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
});
