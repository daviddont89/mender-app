// HelpAndFAQScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HelpAndFAQScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & FAQs</Text>
      <Text style={styles.q}>How much does a job cost?</Text>
      <Text style={styles.a}>Clients are charged $75/hour. There’s a 1-hour minimum including drive time.</Text>

      <Text style={styles.q}>What do contractors get paid?</Text>
      <Text style={styles.a}>Contractors are paid $50/hour. We keep the difference to run Mender.</Text>

      <Text style={styles.q}>Can I cancel or change a job?</Text>
      <Text style={styles.a}>Yes, you can edit or cancel a job as long as it hasn’t been started.</Text>

      <Text style={styles.q}>How do I become a contractor?</Text>
      <Text style={styles.a}>Apply in the app! Go to Contractor Application and submit your details.</Text>

      <Text style={styles.q}>How do I report a problem?</Text>
      <Text style={styles.a}>Use the Contact Us link in the drawer menu. We respond within 24 hours.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#008080' },
  q: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  a: { marginBottom: 10 },
});
