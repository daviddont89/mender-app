// JobReviewScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function JobReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { job } = route.params;

  const contractorId = auth.currentUser.uid;
  const clientId = job.clientId;

  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numericRating = parseInt(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      Alert.alert('Invalid Rating', 'Please enter a number between 1 and 5.');
      return;
    }

    if (job.status !== 'Completed') {
      Alert.alert('Unavailable', 'You can only review the client after the job is completed.');
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, 'reviews'), {
        jobId: job.id,
        contractorId,
        clientId,
        rating: numericRating,
        review,
        type: 'client',
        createdAt: Timestamp.now(),
      });

      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      navigation.goBack();
    } catch (error) {
      console.error('Review error:', error);
      Alert.alert('Error', 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate This Client</Text>

      <TextInput
        placeholder="Rating (1–5)"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
        style={styles.input}
        maxLength={1}
      />

      <TextInput
        placeholder="Optional feedback"
        multiline
        value={review}
        onChangeText={setReview}
        style={[styles.input, { height: 100 }]}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: {
    fontSize: 22,
    color: '#008080',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
