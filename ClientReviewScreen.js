// ClientReviewScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ClientReviewScreen({ route }) {
  const { jobId, contractorId } = route.params;
  const [review, setReview] = useState('');

  const handleSubmit = async () => {
    if (!review.trim()) {
      return Alert.alert('Empty Review', 'Please write a review before submitting.');
    }

    try {
      await setDoc(doc(db, 'contractorReviews', `${jobId}_${contractorId}`), {
        jobId,
        contractorId,
        reviewerId: auth.currentUser.uid,
        review,
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Submitted', 'Your review has been submitted.');
      setReview('');
    } catch (err) {
      Alert.alert('Error', 'Could not submit review.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a Review</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="What did you think of the contractor’s work?"
        value={review}
        onChangeText={setReview}
      />
      <Button title="Submit Review" onPress={handleSubmit} color="#008080" />
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
    textAlignVertical: 'top',
  },
});
