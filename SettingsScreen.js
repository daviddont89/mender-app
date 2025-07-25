// SettingsScreen.js

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <Text style={styles.version}>App Version: 1.0.0</Text>
      <Text style={styles.positive}>Thanks for using Mender! 💚</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#008080', marginBottom: 18 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  label: { fontSize: 16, color: '#222' },
  version: { marginTop: 30, color: '#888', fontSize: 13 },
  positive: { marginTop: 18, color: '#008080', fontWeight: 'bold', fontSize: 15 },
});
