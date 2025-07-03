// AdminRatingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
// You can import from Firestore here when your ratings data is ready
// import { db } from './firebase';
// import { collection, getDocs } from 'firebase/firestore';

const AdminRatingScreen = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder data for now
  const dummyData = [
    { id: '1', type: 'Contractor', user: 'jane@example.com', score: '4.8', feedback: 'Great work and communication.' },
    { id: '2', type: 'Client', user: 'bob@example.com', score: '3.9', feedback: 'Was not home at scheduled time.' },
  ];

  useEffect(() => {
    // Replace with Firestore fetch later
    setTimeout(() => {
      setRatings(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.type} Rating</Text>
      <Text style={styles.user}>User: {item.user}</Text>
      <Text style={styles.score}>Score: {item.score}</Text>
      <Text style={styles.feedback}>Feedback: {item.feedback}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ratings Overview</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00bcd4" />
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default AdminRatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  user: {
    fontSize: 14,
    marginTop: 4,
  },
  score: {
    fontSize: 14,
    marginTop: 4,
  },
  feedback: {
    fontSize: 13,
    marginTop: 6,
    color: '#555',
  },
});
