// ReviewHistoryScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dummyReviews = [
  { id: '1', reviewer: 'Client A', rating: 5, comment: 'Great work!' },
  { id: '2', reviewer: 'Client B', rating: 4, comment: 'On time and professional.' },
];

export default function ReviewHistoryScreen() {
  const [reviews, setReviews] = useState([]);
  // Add faux/test review history for demo if empty
  if (reviews.length === 0) {
    setReviews([
      { id: 'rh1', reviewer: 'Jane Client', target: 'Carlos Martinez', rating: 5, text: 'Great work and communication!', date: '2023-09-05' },
      { id: 'rh2', reviewer: 'Bob Smith', target: 'Jane Smith', rating: 4, text: 'Job done well, a bit late.', date: '2023-08-22' },
      { id: 'rh3', reviewer: 'Alice Lee', target: 'Handy Pros LLC', rating: 5, text: 'Super fast and professional.', date: '2023-07-15' },
    ]);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.review}>
            <Text style={styles.reviewer}>{item.reviewer}</Text>
            <Text>Rating: {item.rating}</Text>
            <Text>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  review: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  reviewer: { fontWeight: 'bold', marginBottom: 5 },
});
