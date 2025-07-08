// LegalMediaReleaseScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

export default function LegalMediaReleaseScreen() {
  const handleAcknowledge = () => {
    // Future: save acknowledgment to user profile
    alert('Acknowledged.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Media Release Agreement</Text>
      <Text style={styles.paragraph}>
        By using the Mender app, you consent to the use of job-related photos or videos for promotional purposes.
        Your name or likeness will never be published without consent. You may opt out by contacting support.
      </Text>
      <Button title="Acknowledge" onPress={handleAcknowledge} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  paragraph: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
});
