// AdminReviewsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function AdminReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reviews'));
      const reviewList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewList);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHideReview = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        hidden: true,
      });
      Alert.alert('Review hidden.');
      fetchReviews();
    } catch (error) {
      console.error('Error hiding review:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderReview = ({ item }) => {
    if (item.hidden) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.rating}>⭐ {item.rating}/5</Text>
        <Text style={styles.text}>"{item.text}"</Text>
        <Text style={styles.meta}>From: {item.fromName}</Text>
        <Text style={styles.meta}>For: {item.toName}</Text>

        <TouchableOpacity
          style={styles.hideButton}
          onPress={() =>
            Alert.alert(
              'Hide Review?',
              'Are you sure you want to hide this review?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Hide',
                  onPress: () => handleHideReview(item.id),
                  style: 'destructive',
                },
              ]
            )
          }
        >
          <Text style={styles.hideButtonText}>Hide</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Reviews</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: '#666',
  },
  hideButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#cc0000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  hideButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

