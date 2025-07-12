import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function AdminSettingsScreen() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaultSettings = {
    clientRate: '75',
    contractorRate: '50',
    featureFlags: {
      ratingSystem: true,
      emergencyJobs: true,
      contractorReview: true,
    },
  };

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'config', 'globalSettings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        await setDoc(docRef, defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      Alert.alert('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'config', 'globalSettings');
      await updateDoc(docRef, settings);
      Alert.alert('Success', 'Settings updated!');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>

      <Text style={styles.label}>Client Hourly Rate ($):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={settings.clientRate.toString()}
        onChangeText={(text) => updateField('clientRate', text)}
      />

      <Text style={styles.label}>Contractor Hourly Rate ($):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={settings.contractorRate.toString()}
        onChangeText={(text) => updateField('contractorRate', text)}
      />

      <Text style={styles.subtitle}>Feature Toggles</Text>

      {Object.entries(settings.featureFlags).map(([key, value]) => (
        <View key={key} style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{key.replace(/([A-Z])/g, ' $1')}</Text>
          <Switch
            value={value}
            onValueChange={() => toggleFeature(key)}
            trackColor={{ true: '#0cb9c1' }}
            thumbColor={value ? '#007C91' : '#ccc'}
          />
        </View>
      ))}

      <View style={styles.buttonWrapper}>
        <Button
          title={saving ? 'Saving...' : 'Save Settings'}
          onPress={saveSettings}
          color="#008080"
          disabled={saving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
    color: '#333',
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
    color: '#555',
  },
  buttonWrapper: {
    marginTop: 24,
  },
});
