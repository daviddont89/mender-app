// PaymentOptionsScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function PaymentOptionsScreen() {
  const [selected, setSelected] = useState(null);
  const options = ['Credit/Debit', 'Venmo', 'PayPal', 'Cash App'];

  const confirm = () => {
    if (!selected) return Alert.alert('Select a payment method');
    Alert.alert('Saved', `Payment method set to: ${selected}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Payment Method</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            { borderColor: selected === option ? '#008080' : '#ccc' },
          ]}
          onPress={() => setSelected(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={confirm}>
        <Text style={styles.buttonText}>Save Payment Option</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 20 },
  option: {
    borderWidth: 2,
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
  optionText: { fontSize: 18 },
  button: {
    marginTop: 20,
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
});
