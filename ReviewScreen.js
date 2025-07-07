// ReviewScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ReviewScreen({ route }) {
  const { role, jobId } = route.params;
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (review.trim().length === 0) {
      return Alert.alert('Please enter a short review.');
    }
    Alert.alert('Review Submitted', 'Thank you for your feedback!');
    setReview('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {role === 'contractor' ? 'Review the Client' : 'Review the Contractor'}
      </Text>
      <TextInput
        value={review}
        onChangeText={setReview}
        placeholder="Write your review here..."
        style={styles.input}
        multiline
        numberOfLines={5}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#007C91',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
