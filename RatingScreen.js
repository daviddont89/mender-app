// RatingScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const options = ['Excellent', 'Good', 'Okay', 'Poor'];

export default function RatingScreen({ route }) {
  const { role, jobId } = route.params;
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (!selected) return Alert.alert('Select a rating');
    Alert.alert('Rating Submitted', `You rated this job: ${selected}`);
    // In real app: save to Firestore
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {role === 'contractor' ? 'Rate the Client' : 'Rate the Contractor'}
      </Text>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selected === option && styles.selected,
          ]}
          onPress={() => setSelected(option)}
        >
          <Text
            style={[
              styles.optionText,
              selected === option && styles.selectedText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
        <Text style={styles.submitText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  option: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007C91',
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#007C91',
  },
  optionText: { textAlign: 'center', fontSize: 16, color: '#007C91' },
  selectedText: { color: '#fff' },
  submit: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#007C91',
    borderRadius: 10,
  },
  submitText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
