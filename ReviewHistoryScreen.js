// ReviewHistoryScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dummyReviews = [
  { id: '1', reviewer: 'Client A', rating: 5, comment: 'Great work!' },
  { id: '2', reviewer: 'Client B', rating: 4, comment: 'On time and professional.' },
];

export default function ReviewHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reviews</Text>
      <FlatList
        data={dummyReviews}
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
