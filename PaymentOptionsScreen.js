import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AuthContext } from './AuthProvider';

export default function PaymentOptionsScreen() {
  const { user } = useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = ['Credit/Debit', 'Venmo', 'PayPal', 'Cash App'];

  useEffect(() => {
    if (!user?.uid) return;
    const fetchOption = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.paymentOption) setSelected(data.paymentOption);
        }
      } catch (err) {
        console.error('Error loading payment option:', err);
      }
      setLoading(false);
    };
    fetchOption();
  }, [user]);

  const confirm = async () => {
    if (!selected) return Alert.alert('Select a payment method first.');

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { paymentOption: selected },
        { merge: true }
      );
      Alert.alert('Saved', `Payment method set to: ${selected}`);
    } catch (err) {
      console.error('Error saving payment option:', err);
      Alert.alert('Error', 'Could not save payment method.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

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
          <Text
            style={[
              styles.optionText,
              selected === option && { color: '#008080', fontWeight: 'bold' },
            ]}
          >
            {option}
          </Text>
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
  optionText: { fontSize: 18, color: '#333' },
  button: {
    marginTop: 20,
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
});
