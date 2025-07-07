// NotificationPreferencesScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function NotificationPreferencesScreen() {
  const [preferences, setPreferences] = useState({
    sms: false,
    email: false,
    push: true,
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const ref = doc(db, 'notificationPreferences', auth.currentUser.uid);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setPreferences(docSnap.data());
        }
      } catch (err) {
        Alert.alert('Error', 'Could not load preferences');
      }
    };
    fetchPreferences();
  }, []);

  const updatePreference = async (key, value) => {
    const updatedPrefs = { ...preferences, [key]: value };
    setPreferences(updatedPrefs);
    try {
      await setDoc(doc(db, 'notificationPreferences', auth.currentUser.uid), updatedPrefs);
    } catch (err) {
      Alert.alert('Error', 'Could not save preferences');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Preferences</Text>
      {['sms', 'email', 'push'].map((type) => (
        <View key={type} style={styles.row}>
          <Text style={styles.label}>{type.toUpperCase()}</Text>
          <Switch
            value={preferences[type]}
            onValueChange={(val) => updatePreference(type, val)}
            trackColor={{ false: '#ccc', true: '#008080' }}
            thumbColor="#fff"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  label: { fontSize: 18 },
});
