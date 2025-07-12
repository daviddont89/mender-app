import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AuthContext } from './AuthProvider';

export default function PaymentSetupScreen() {
  const { user, userRole } = useContext(AuthContext);
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');
  const [loading, setLoading] = useState(false);

  const labelSet = userRole === 'contractor'
    ? ['Routing Number', 'Account Number', 'Bank Name']
    : ['Card Number', 'Exp Date (MM/YY)', 'CVC'];

  useEffect(() => {
    if (!user?.uid) return;
    const loadData = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.paymentMethod) {
            setField1(data.paymentMethod.field1 || '');
            setField2(data.paymentMethod.field2 || '');
            setField3(data.paymentMethod.field3 || '');
          }
        }
      } catch (err) {
        console.error('Failed to load payment info:', err);
      }
    };
    loadData();
  }, [user]);

  const handleSave = async () => {
    if (!field1 || !field2 || !field3) {
      Alert.alert('Missing Info', 'Please complete all fields.');
      return;
    }

    setLoading(true);
    try {
      const ref = doc(db, 'users', user.uid);
      await setDoc(
        ref,
        {
          paymentMethod: {
            role: userRole,
            field1,
            field2,
            field3,
            lastUpdated: new Date().toISOString(),
          },
        },
        { merge: true }
      );
      Alert.alert('Success', 'Your payment information has been saved.');
    } catch (err) {
      console.error('Error saving payment info:', err);
      Alert.alert('Error', 'Could not save payment info.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {userRole === 'contractor' ? 'Set Up Direct Deposit' : 'Add Payment Method'}
      </Text>

      <TextInput
        placeholder={labelSet[0]}
        value={field1}
        onChangeText={setField1}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={labelSet[1]}
        value={field2}
        onChangeText={setField2}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={labelSet[2]}
        value={field3}
        onChangeText={setField3}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#008080" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save Payment Info</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
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
