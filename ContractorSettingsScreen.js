// ContractorSettingsScreen.js

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';

export default function ContractorSettingsScreen() {
  const [available, setAvailable] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contractor Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Available for Jobs</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <Text style={styles.note}>
        Payment setup coming soon. You’ll be able to configure payout options and link accounts in a future update.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: { fontSize: 16 },
  note: { marginTop: 30, fontSize: 14, color: '#666' },
});
