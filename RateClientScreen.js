// RateClientScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

export default function RateClientScreen({ navigation }) {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    // Future: submit rating to Firestore
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate This Client</Text>
      <TextInput
        placeholder="1–5"
        keyboardType="numeric"
        style={styles.input}
        value={rating}
        onChangeText={setRating}
      />
      <TextInput
        placeholder="Leave a comment (optional)"
        multiline
        style={[styles.input, { height: 80 }]}
        value={review}
        onChangeText={setReview}
      />
      <Button title="Submit Rating" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
