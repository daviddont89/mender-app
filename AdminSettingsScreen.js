// AdminSettingsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export default function AdminSettingsScreen() {
  const [settings, setSettings] = useState({
    clientRate: '',
    contractorRate: '',
    featureFlags: {
      ratingSystem: true,
      emergencyJobs: true,
      contractorReview: true,
    },
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'config', 'globalSettings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        await setDoc(docRef, settings);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      Alert.alert('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const docRef = doc(db, 'config', 'globalSettings');
      await updateDoc(docRef, settings);
      Alert.alert('Settings updated successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      Alert.alert('Failed to update settings');
    }
  };

  const toggleFeature = (key) => {
    setSettings((prev) => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        [key]: !prev.featureFlags[key],
      },
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>

      <Text style={styles.label}>Client Hourly Rate ($):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={settings.clientRate.toString()}
        onChangeText={(text) =>
          setSettings((prev) => ({ ...prev, clientRate: text }))
        }
      />

      <Text style={styles.label}>Contractor Hourly Rate ($):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={settings.contractorRate.toString()}
        onChangeText={(text) =>
          setSettings((prev) => ({ ...prev, contractorRate: text }))
        }
      />

      <Text style={styles.subtitle}>Feature Toggles</Text>

      {Object.entries(settings.featureFlags).map(([key, value]) => (
        <View key={key} style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{key}</Text>
          <Switch
            value={value}
            onValueChange={() => toggleFeature(key)}
          />
        </View>
      ))}

      <View style={styles.buttonWrapper}>
        <Button title="Save Settings" onPress={saveSettings} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleLabel: {
    textTransform: 'capitalize',
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 24,
  },
});
