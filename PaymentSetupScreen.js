// PaymentSetupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function PaymentSetupScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSave = () => {
    Alert.alert('Saved', 'Payment method saved (placeholder)');
    setCardNumber('');
    setExpDate('');
    setCvc('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>
      <TextInput
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Expiration Date (MM/YY)"
        value={expDate}
        onChangeText={setExpDate}
        style={styles.input}
      />
      <TextInput
        placeholder="CVC"
        value={cvc}
        onChangeText={setCvc}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Payment Info</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007C91',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
