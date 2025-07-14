// RateContractorScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export default function RateContractorScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId, contractorId, contractorName } = route.params || {};

  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numericRating = parseInt(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      Alert.alert('Invalid Rating', 'Please enter a number between 1 and 5.');
      return;
    }

    if (!jobId || !contractorId) {
      Alert.alert('Missing Info', 'Job or contractor ID is missing.');
      return;
    }

    try {
      setSubmitting(true);

      // Add review to Firestore
      await addDoc(collection(db, 'reviews'), {
        jobId,
        contractorId,
        clientId: auth.currentUser.uid,
        rating: numericRating,
        review,
        createdAt: Timestamp.now(),
        type: 'contractor',
      });

      // Update the job to mark it as rated
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, { rated: true });

      Alert.alert('Success', 'Your review has been submitted.');
      navigation.goBack();
    } catch (err) {
      console.error('Review error:', err);
      Alert.alert('Error', 'Could not submit your review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {contractorName ? `Rate ${contractorName}` : 'Rate Your Contractor'}
      </Text>
      <TextInput
        placeholder="Rating (1–5)"
        keyboardType="numeric"
        style={styles.input}
        value={rating}
        onChangeText={setRating}
        maxLength={1}
      />
      <TextInput
        placeholder="Optional feedback"
        multiline
        style={[styles.input, { height: 100 }]}
        value={review}
        onChangeText={setReview}
      />
      <Button
        title={submitting ? 'Submitting...' : 'Submit Review'}
        onPress={handleSubmit}
        disabled={submitting}
        color="#008080"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
});
