// ReviewClientScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ReviewClientScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params;

  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');

  const submitReview = async () => {
    try {
      const ref = doc(db, 'jobs', jobId);
      await updateDoc(ref, {
        clientReview: review,
        clientRating: parseInt(rating),
      });
      Alert.alert('Review Submitted', 'Thank you for your feedback.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Could not submit review.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Review Client</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your review..."
        value={review}
        onChangeText={setReview}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1–5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <Button title="Submit Review" onPress={submitReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});
