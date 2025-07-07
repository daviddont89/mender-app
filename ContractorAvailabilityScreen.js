// ContractorAvailabilityScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ContractorAvailabilityScreen() {
  const [available, setAvailable] = useState(false);

  const toggleAvailability = async (value) => {
    setAvailable(value);
    try {
      await setDoc(doc(db, 'contractorAvailability', auth.currentUser.uid), {
        available: value,
        updatedAt: new Date(),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const fetchAvailability = async () => {
    const docRef = doc(db, 'contractorAvailability', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAvailable(docSnap.data().available);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability Status</Text>
      <Text style={styles.status}>{available ? 'Available for Jobs' : 'Unavailable'}</Text>
      <Switch
        value={available}
        onValueChange={toggleAvailability}
        trackColor={{ false: '#767577', true: '#008080' }}
        thumbColor={available ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    marginVertical: 10,
  },
});
