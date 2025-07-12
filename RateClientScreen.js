import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function RateClientScreen({ route, navigation }) {
  const { jobId } = route.params;
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      Alert.alert('Missing Rating', 'Please select a rating between 1 and 5.');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        clientRating: parseInt(rating),
        clientRatingNote: review.trim(),
        ratingSubmitted: true,
      });
      Alert.alert('Thank you!', 'Your rating has been submitted.');
      navigation.goBack();
    } catch (err) {
      console.error('Error submitting rating:', err);
      Alert.alert('Error', 'Could not save rating. Try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate This Client</Text>
      <Text style={styles.subtitle}>Your feedback is private and helps us monitor client quality.</Text>

      <Text style={styles.label}>Rating (1–5):</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={rating} onValueChange={setRating} style={styles.picker}>
          <Picker.Item label="Select Rating" value="" />
          <Picker.Item label="1 - Difficult" value="1" />
          <Picker.Item label="2 - Needs improvement" value="2" />
          <Picker.Item label="3 - Neutral" value="3" />
          <Picker.Item label="4 - Good" value="4" />
          <Picker.Item label="5 - Great to work with" value="5" />
        </Picker>
      </View>

      <Text style={styles.label}>Comment (optional):</Text>
      <TextInput
        placeholder="Any additional comments..."
        multiline
        style={styles.input}
        value={review}
        onChangeText={setReview}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#008080" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Submit Rating" color="#008080" onPress={handleSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#008080', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 6, color: '#333' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: { height: 50, width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 30,
  },
});
